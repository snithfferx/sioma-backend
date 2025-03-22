import { z } from "zod";

export const RegisterSchema = z.object({
    name: z.string().trim().min(3, {
        message: "Name must be at least 3 characters"
    }),
    username: z.string().trim().toLowerCase().min(3, {
        message: "Username must be at least 3 characters"
    }),
    email: z.string().trim().toLowerCase().email({
        message: "Invalid email address"
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters"
    }),
    userName: z.string().trim().toLowerCase().min(3, {
        message: "Username must be at least 3 characters"
    }),
    firstName: z.string().trim().min(3, {
        message: "First name must be at least 3 characters"
    }),
    secondName: z.string().trim().nullable(),
    firstLastName: z.string().trim().min(3, {
        message: "First last name must be at least 3 characters"
    }),
    secondLastName: z.string().trim().nullable(),
    thirdName: z.string().trim().nullable(),
    thirdLastName: z.string().trim().nullable(),
    gender: z.string().trim().nullable(),
    birthday: z.number().nullable(),
    address: z.string().trim().nullable(),
    phone: z.string().trim().nullable()
});

export const LoginSchema = z.object({
    email: z.string().trim().toLowerCase().email({
        message: "Invalid email address"
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters"
    }),
    userName: z.string().min(3, {
        message: "Username must be at least 3 characters"
    }).nullable()
});