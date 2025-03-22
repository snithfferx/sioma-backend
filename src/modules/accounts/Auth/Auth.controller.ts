import { verifyPassword } from '@Utils/password';
import { AuthModel } from '@Modules/accounts/Auth/Auth.model';
import type { RegisterRequest, Users } from '@Schemas/Auth.schema';
import { PersonaModel } from '@Modules/accounts/users/Persona.model';

const authModel = new AuthModel();
const personaModel = new PersonaModel();

export class AuthController {
    constructor() { }

    async registerUser(
        data: RegisterRequest) {
        const user = await authModel.getUserByEmail(data.email);
        if (user.length !== 0) {
            return null;
        }
        const passwordHashed = await Bun.password.hash(data.password);
        const userName = data.userName ?? data.email.split('@')[0];
        const newUser = await authModel.addUser({
            email: data.email,
            password: passwordHashed,
            userName: userName
        });
        if (newUser) {
            const person = await personaModel.addNewPerson({
                firstName: data.firstName,
                secondName: data.secondName,
                firstLastName: data.firstLastName,
                secondLastName: data.secondLastName,
                thirdName: data.thirdName,
                thirdLastName: data.thirdLastName,
                gender: data.gender,
                birthday: data.birthday,
                address: data.address,
                phone: data.phone
            });
            if (person) {
                return {
                    id: newUser[0].id,
                    email: data.email,
                    username: userName
                }
            }
        }
    }

    async login(email: string, password: string, username: string | null) {
        let userData: Users = [];
        if (username) {
            userData = await authModel.getUserByName(username);
        } else {
            userData = await authModel.getUserByEmail(email);
        }
        if (userData.length === 0) {
            return null;
        }
        if (userData.length > 1) {
            return null;
        }
        // if user exists, check if password is correct
        const isPasswordCorrect = verifyPassword(password, userData[0].password) //await Bun.password.verify(password,userData[0].pass);
        if (!isPasswordCorrect) {
            return null;
        }
        // if password correct, return user
        return {
            id: userData[0].id,
            email: userData[0].email,
            username: username
        }
    }
}