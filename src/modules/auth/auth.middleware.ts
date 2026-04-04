import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../../common/utils/jwt.utils";

export function authenticationMiddleware() {
    return function (req: Request, res: Response, next: NextFunction) {
        const header = req.headers["authorization"];
        if (!header) return next();

        if (!header?.startsWith("Bearer"))
            return res
                .status(400)
                .json({ error: "authorization header must start with Bearer" });

        const token = header.split(" ")[1];
        if (!token)
            return res.status(400).json({
                error: "authorization header must start with Bearer and followed by token",
            });

        const user = verifyAccessToken(token);
        req.user = user;

        next();
    };
}

export function restrictToAuthenticatedUser() {
    return function (req: Request, res: Response, next: NextFunction) {
        if (!req.user)
            return res.status(401).json({ error: "Authentication Required" });
        return next();
    };
}
