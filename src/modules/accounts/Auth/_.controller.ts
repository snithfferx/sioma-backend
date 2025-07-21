import { AuthModel } from '@Modules/accounts/auth/_.model';
import type { RegisterRequest } from '@Types/schemas/accounts/auth.schema';
import { hash } from 'bcryptjs';
import { PersonsController } from '@Modules/accounts/persons/_.controller';
import { UsersController } from '@Modules/accounts/users/_.controller';
import { verifyPassword } from '@App/utils/password';
import { SessionsController } from '@App';
import { generateJwtToken, generateEmailVerificationToken, generateResetToken verifyEmailVerificationToken } from '@Utils/token';
import { APP_REDIRECT_URI } from '@App';
import { sendEmail } from '@Utils/email';


export class AuthController {
	model = new AuthModel();
	personsController = new PersonsController();
	usersController = new UsersController();
	sessionsController = new SessionsController();
	constructor() { }

	async registerUser(data: Partial<RegisterRequest>) {
		if (!data.email || !data.password) return { status: 'fail', data: null, message: 'Falta el email o la contraseña' };
		// Check by email if user already exists
		const user = await this.model.getUserByEmail(data.email);
		if (user.length !== 0) return { status: 'fail', data: null, message: 'User already exists.' };
		// Check by username if user already exists
		const userByUsername = await this.model.getUserByName(data.userName);
		if (userByUsername.length !== 0) return { status: 'fail', data: null, message: 'User already exists.' };
		// Hash password
		const passwordHashed = await hash(data.password, 10); //await Bun.password.hash(data.password);
		const userName = data.userName ?? data.email.split('@')[0];
		// Add new person
		const person = await this.personsController.addNewPerson({
			firstName: data.firstName ?? userName,
			firstLastName: data.firstLastName ?? userName,
			email: data.email
		});
		if (person) {
			// Add new contact
			const contact = await this.personsController.addNewContact({
				name: userName + ' contact',
				email: data.email,
				homePhone: data.phone ?? null,
				mobilePhone: data.phone ?? null,
				status: 1
			});
			if (!contact) {
				return { status: 'fail', data: null, message: 'Error creando el contacto' };
			}
			// Add new user
			const newUser = await this.usersController.addUser({
				name: userName,
				email: data.email,
				password: passwordHashed,
				phone: data.phone ?? undefined,
				person: person.id,
				level: 1,
				status: 1
			});
			if (!newUser || !newUser.data) {
				return { status: 'fail', data: null, message: 'Error creando el usuario' };
			}
			const userId = newUser.data.id;
			// Generate email verification token
			const emailVerificationToken = generateEmailVerificationToken(userId);
			// Generate jwt token
			const jwtToken = generateJwtToken(newUser.data?.id || '');
			// Enviar email de verificación
			const verificationUrl = `${APP_REDIRECT_URI}/verify-email?token=${emailVerificationToken}`;
			await sendEmail(
				user.email,
				'Verifica tu Email',
				`Por favor, haz clic en el siguiente enlace para verificar tu email: <a href="${verificationUrl}">${verificationUrl}</a>`
			);
			return {
				status: 'ok',
				data: {
					email: data.email,
					username: userName,
					signature: newUser.data?.signature ?? ''
				},
				message: 'Usuario registrado exitosamente. Por favor, verifica tu email para activar tu cuenta.'
			};
		}
		return { status: 'fail', data: null, message: 'Error creando la persona' };
	}

	async login(email: string, password: string, username?: string) {
		// Get User data
		let userData: { id: string, name: string, email: string, password: string, level: number, signature: string }[] = [];
		if (username) {
			const user = await this.usersController.getUserByName(username);
			userData = user ? [{ id: user.data?.id || '', name: user.data?.name || '', email: user.data?.email || '', password: user.data?.password || '', level: user.data?.level || 1, signature: user.data?.verifiedToken || '' }] : [];
		} else {
			const user = await this.usersController.getUserByEmail(email);
			userData = [{ id: user.data?.id || '', name: user.data?.name || '', email: user.data?.email || '', password: user.data?.password || '', level: user.data?.level || 1, signature: user.data?.verifiedToken || '' }];
		}
		// Check if user exists
		if (userData.length === 0) {
			return { status: 'fail', data: null, message: 'User not found' };
		}
		// Check if more than one user exists
		if (userData.length > 1) {
			return { status: 'fail', data: null, message: 'More than one user exists' };
		}
		// Check if user id is empty
		if (!userData[0].id) return { status: 'fail', data: null, message: 'User not found' };
		// if user exists, check if password is correct
		const isPasswordCorrect = verifyPassword(password, userData[0].password) //await Bun.password.verify(password,userData[0].pass);
		if (!isPasswordCorrect) {
			return { status: 'fail', data: null, message: 'Invalid password' };
		}
		// Get user id
		const id = userData[0].id;
		// Get user session
		const sessions = await this.sessionsController.getSession(id);
		// Generate new session token
		const newSessionToken = await generateToken({
			user: {
				email: userData[0].email,
				name: userData[0].name,
				level: userData[0].level
			},
			exp: Math.floor(Date.now() / 1000) + (60 * 60 * 4) // 4 hours
		});
		// Check if session is created
		if (sessions.data) {
			// Check if token is expired
			if (sessions.data.expires < new Date().getTime()) {
				// Soft delete
				await this.sessionsController.deleteSession(id);
			}
			// Update token and expiry
			await this.sessionsController.updateSession(sessions.data.id, {
				token: newSessionToken ?? '',
				expires: Math.floor(Date.now() / 1000) + (60 * 60 * 4) // 4 hours
			});
		} else {
			// create session
			await this.sessionsController.createSession({
				userId: id,
				token: newSessionToken ?? '',
				expires: Math.floor(Date.now() / 1000) + (60 * 60 * 4), // 4 hours
				apiToken: ''
			});
		}
		// if password correct, return user
		return {
			status: 'ok',
			data: {
				email: userData[0].email,
				name: userData[0].name,
				signature: userData[0].signature,
				level: userData[0].level,

			},
			message: 'User logged in successful'
		}
	}

	async forgotPassword(email: string) {
		const userData = await this.usersController.getUserByEmail(email);
		if (!userData.data) {
			return { status: 'fail', data: null, message: 'User not found' };
		}
		// get temp session
		const tempSession = await this.sessionsController.getTempSession(email);
		if (tempSession.data) {
			// check if tries reach 5
			if (tempSession.data.tries >= 5) {
				return { status: 'fail', data: null, message: 'Too many attempts' };
			}
			// check if temp session is expired
			if (tempSession.data.expires < new Date().getTime()) {
				// delete temp session
				await this.sessionsController.deleteTempSession(email);
			}
		}
		// generate token to send in email
		const token = await generateToken({
			user: {
				email: userData.data.email,
				name: userData.data.name,
				level: userData.data.level ?? 1
			},
			exp: Math.floor(Date.now() / 1000) + (60 * 30) // 30 minutes
		});
		// save token in db
		await this.usersController.updateUserResetToken(userData.data.id, token);
		const verificationUrl = `${APP_REDIRECT_URI}/reset-password?token=${token}`;
		await sendEmail(
			userData.data.email,
			'Reseteo de contraseña',
			`Por favor, haz clic en el siguiente enlace para resetear tu contraseña: <a href="${verificationUrl}">${verificationUrl}</a>`
		);
		return { status: 'ok', message: 'Se ha enviado un enlace para restablecer tu contraseña a tu email.' }
};

	async changePassword(id: string, password: string) {
		const userData = await this.usersController.getUserById(id);
		if (!userData.data) {
			return { status: 'fail', data: null, message: 'User not found' };
		}
		// update password
		await this.usersController.updateUser(userData.data.id, { password: password });
		return { status: 'ok', data: null, message: 'Password changed successful' };
	}
	/* // 4. Reestablecer Contraseña (usar token de restablecimiento)
export const resetPassword = [
  validate(resetPasswordSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, newPassword } = req.body;

      let decoded: jwt.JwtPayload;
      try {
        decoded = verifyResetToken(token) as jwt.JwtPayload;
      } catch (err) {
        return res.status(400).json({ message: 'Token de restablecimiento inválido o expirado.' });
      }

      const user = await User.findById(decoded.id);

      if (!user || user.passwordResetToken !== token || user.passwordResetExpires! < new Date()) {
        return res.status(400).json({ message: 'Token de restablecimiento inválido o expirado.' });
      }

      user.password = newPassword; // El middleware 'pre-save' se encargará de hashear
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      res.status(200).json({ message: 'Contraseña restablecida exitosamente.' });
    } catch (error) {
      next(error);
    }
  },
];
// 5. Verificación de Email (usar token de verificación)
export const verifyEmail = [
  validate(verifyEmailSchema), // Usar el esquema de validación para el token de email
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body; // El token viene del body, asumiendo una petición POST

      let decoded: jwt.JwtPayload;
      try {
        decoded = verifyEmailVerificationToken(token) as jwt.JwtPayload;
      } catch (err) {
        return res.status(400).json({ message: 'Token de verificación inválido o expirado.' });
      }

      const user = await User.findById(decoded.id);

      if (!user || user.emailVerificationToken !== token || user.emailVerificationExpires! < new Date()) {
        return res.status(400).json({ message: 'Token de verificación inválido o expirado.' });
      }

      user.isVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();

      res.status(200).json({ message: 'Email verificado exitosamente. ¡Tu cuenta está activa!' });
    } catch (error) {
      next(error);
    }
  },
];
*/
}
