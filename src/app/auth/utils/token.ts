import jwt from "jsonwebtoken";

interface UserTokenPayload {
    id: string;
}

const JWT_SECRET = "fdfwf";

export function createUserToken(payload: UserTokenPayload) {
    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: "15m",
    });
    return token;
}

export function verifyUserToken(token: string) {
    try {
        const payload = jwt.verify(token, JWT_SECRET) as UserTokenPayload;
        return payload;
    } catch (error) {
        return null;
    }
}
