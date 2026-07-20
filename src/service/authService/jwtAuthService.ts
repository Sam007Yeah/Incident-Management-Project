import type { AuthenticationInterface } from "../../AuthInterface/AuthenticationInterface.js"
import type { AuthenticatedUser } from "../../types/authentcatedUser.js"
import { jwtService } from "./../jwtService.js"

export class JwtAuthService implements AuthenticationInterface {

    authenticate(credentials: unknown): Promise<AuthenticatedUser | null> {
        const token = (credentials as any).token ? (credentials as any).token : null;
        if (!token) {
            const error = new Error("Token is missing");
            (error as any).statusCode = 401;
            return Promise.reject(error);
        }

        const decoded_payload: any = jwtService().verifyToken(token);

        const user: Object = {
            username: decoded_payload.id,
            email: decoded_payload.email,
            role: decoded_payload.roles,
            id: decoded_payload.id,
            team: decoded_payload.team
        }

        Object.entries(user).forEach((value: any) => {
            if (value === null || value === undefined) {
                const error = new Error("Invalid token payload");
                (error as any).statusCode = 401;
                return Promise.reject(error);
            }
        });

        return Promise.resolve(user as AuthenticatedUser);
    }
}