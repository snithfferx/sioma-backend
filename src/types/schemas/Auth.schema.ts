export interface AuthRequest {
    user?: {
        id: number;
        email: string;
    };
}

export interface LoginRequest {
    email: string;
    password: string;
    userName: string | null;
}

export interface RegisterRequest extends LoginRequest {
    firstName: string;
    secondName?: string | null;
    firstLastName: string;
    secondLastName?: string | null;
    thirdName?: string | null;
    thirdLastName?: string | null;
    gender?: string | null;
    birthday?: number | null;
    address?: string | null;
    phone?: string | null;
}

export interface Session {
    id: string;
    userId: number;
    token: string;
    expires: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
}

export interface ShopifySession {
    id: string;
    shop: string;
    state: string;
    isOnline: boolean;
    scope: string;
    expires: string;
    accessToken: string;
    userId: number;
}

export interface User {
    id: number;
    userName: string;
    email: string;
    password: string;
}

export interface UserResponse {
    id: number;
    userName: string;
    email: string;
}

export type Sessions = Session[];
export type ShopifySessions = ShopifySession[];
export type Users = User[];
export type UserResponses = UserResponse[];
export type AuthRequests = AuthRequest[];
export type LoginRequests = LoginRequest[];
export type RegisterRequests = RegisterRequest[];
