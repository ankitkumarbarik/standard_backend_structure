import { z } from "zod";

export const signupSchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().nullable().optional(),
    email: z.email(),
    password: z.string().min(6),
});

export const signinSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
});

export type SignupDTO = z.infer<typeof signupSchema>;
export type SigninDTO = z.infer<typeof signinSchema>;
