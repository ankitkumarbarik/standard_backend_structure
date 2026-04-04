import { ZodType } from "zod";
import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/api-error";

const validate = <T>(schema: ZodType<T>) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const errors = result.error.issues.map((e) => e.message);
            throw ApiError.badRequest(errors.join(", "));
        }

        req.body = result.data;
        next();
    };
};

export default validate;
