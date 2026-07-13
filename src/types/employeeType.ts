import { z } from 'zod';

export type Employee = {
    id: string;
    name: string;
    email: string;
    team_id: string;
    password_hash: string;
}

export type EmployeeUpdate = {
    name?: string;
    email?: string;
    team_id?: string;
    password_hash?: string;
}

export const EmployeeUpdateSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.string().email("Invalid email address").optional(),
    team_id: z.string().min(1, "Team ID is required").optional(),
    password_hash: z.string().min(6, "Password must be at least 6 characters long").optional()
});

export const EmployeeSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    team_id: z.string().min(1, "Team ID is required"),
    password_hash: z.string().min(6, "Password must be at least 6 characters long")
});