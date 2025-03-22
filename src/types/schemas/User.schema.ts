export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    phone: string;
    person: number;
    level: number;
    contact: number;
    resetToken: string | null;
    tokenExpiry: Date | null;
    apiToken: string | null;
    verifiedToken: string | null;
    emailVerified: boolean;
    createdAt: Date | null;
    updatedAt: Date | null;
};

export interface UserResponse {
    id: number;
    name: string;
    email: string;
    phone: string;
    person: number;
    level: number;
    contact: number;
    resetToken: string | null;
    tokenExpiry: Date | null;
    apiToken: string | null;
    verifiedToken: string | null;
    emailVerified: boolean;
    createdAt: Date | null;
    updatedAt: Date | null;
};


export type Users = User[];