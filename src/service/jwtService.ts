import jwt, { type JwtPayload } from 'jsonwebtoken';

export function jwtService() {
    const secret = "thiskeyissupersecureandsafefortestingandlaterwouldberemoved";

    return {
        createToken(payload: object): string {
            const token = jwt.sign(payload, secret, { algorithm: "HS512", expiresIn: '1h' });
            return token;
        },

        verifyToken(token: string): JwtPayload | string | null {
            try {
                const decoded = jwt.verify(token, secret, { algorithms: ["HS512"] });
                return decoded;
            }
            catch (err) {
                console.error("Error verifying token:", err);
                return null;
            }
        }
    }
}