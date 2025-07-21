import { SessionModel } from "./session.model";
import type { SessionSchema } from "@Types/accounts/session.schema";
export class SessionsController {
    model = new SessionModel();
    constructor() { }

    async createSession(session: SessionSchema) {
        const result = await this.model.createSession(session);
        return { status: 'ok', data: result, message: 'Session created successful' };
    }

    async getSession(userId: string) {
        const result = await this.model.getSession(userId);
        return { status: 'ok', data: result, message: 'Session created successful' };
    }

    async deleteSession(userId: string) {
        const result = await this.model.deleteSession(userId);
        return { status: 'ok', data: result, message: 'Session deleted successful' };
    }

    async updateSession(session: number, data: { token: string, expires: number }) {
        const result = await this.model.updateSession(session, data);
        return { status: 'ok', data: result, message: 'Session updated successful' };
    }

    async getTempSession(email: string) {
        const result = await this.model.getTempSession(email);
        return { status: 'ok', data: result, message: 'Session created successful' };
    }

    async deleteTempSession(email: string) {
        const result = await this.model.deleteTempSession(email);
        return { status: 'ok', data: result, message: 'Session deleted successful' };
    }

    async createTempSession(user: string) {
        const result = await this.model.createTempSession(user);
        return { status: 'ok', data: result, message: 'Session created successful' };
    }

    async updateTempSession(email: string, tempToken: string, tries: number) {
        const result = await this.model.updateTempSession(email, tempToken, tries);
        return { status: 'ok', data: result, message: 'Session updated successful' };
    }
}
