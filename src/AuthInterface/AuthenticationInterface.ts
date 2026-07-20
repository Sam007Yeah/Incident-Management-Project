import type { AuthenticatedUser } from "../types/authentcatedUser.js";

export interface AuthenticationInterface {
    authenticate(credentials: unknown): Promise<AuthenticatedUser | null>;
}