import { generateToken } from '@Utils/token';
import { hashPassword } from '@Utils/password';
import { LoginRequest, RegisterRequest } from '@Schemas/Auth.schema';
import { AuthController } from '@Modules/accounts/Auth/Auth.controller';

const authController = new AuthController();
export class AuthService {
    constructor() { }

    async login({ email, password, userName }: LoginRequest) {
        const user = await authController.login(email, password, userName);
        if (!user) {
            return null;
        }
        const token = await generateToken({ id: user.id, email: user.email });
        return { user, token };
    }

    async signup({
        email,
        password,
        userName,
        firstName,
        secondName,
        firstLastName,
        secondLastName,
        thirdName,
        thirdLastName,
        gender,
        birthday,
        address,
        phone }: RegisterRequest) {
        const hashedPassword = await hashPassword(password);
        let user_name = userName;
        if (!user_name) {
            const emailSplited = email.split('@')[0];
            user_name = emailSplited;
        }
        return await authController.registerUser({
            email: email,
            password: hashedPassword,
            userName: user_name,
            firstName: firstName,
            secondName: secondName,
            firstLastName: firstLastName,
            secondLastName: secondLastName,
            thirdName: thirdName,
            thirdLastName: thirdLastName,
            gender: gender,
            birthday: birthday,
            address: address,
            phone: phone
        });
    }
}