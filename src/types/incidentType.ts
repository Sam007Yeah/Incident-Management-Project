import { z } from 'zod';

export type Incident = {
    id: string;
    title: string;
    description: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'critical';
    start_date: Date;
    updated_at: Date;
    team_id: string;
    assigned_to: string;
    created_by_id: string;
}

export type IncidentUpdate = {
    title?: string;
    description?: string;
    status?: 'open' | 'in_progress' | 'resolved' | 'closed';
    priority?: 'low' | 'medium' | 'high' | 'critical';
    team_id?: string;
    assigned_to?: string;
}

export const IncidentUpdateSchema = z.object({
    title: z.string().min(1, "Title is required").optional(),
    description: z.string().min(1, "Description is required").optional(),
    status: z.enum(['open', 'in_progress', 'resolved', 'closed']).optional(),
    priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
    team_id: z.string().min(1, "Team ID is required").optional(),
    assigned_to: z.string().min(1, "Assigned to ID is required").optional()
})
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided for update",
    });

export const IncidentSchema = z.object({
    id: z.string(),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    priority: z.enum(['low', 'medium', 'high', 'critical']),
    created_by_id: z.string().min(1, "Created by ID is required")
})