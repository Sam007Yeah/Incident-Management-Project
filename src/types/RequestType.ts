import { email, z } from 'zod';

export type LoginRequest = {
    email: string;
    password: string;
};

export type LoginResponse = {
    token: string;
};

export const LoginRequestSchema = z.object({
    email: z.string("email address is required"),
    password: z.string("Password is required")
})

export const AssignRoleRequestSchema = z.object({
    role_id: z.string("Role ID is required")
});