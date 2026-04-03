import express from "express";
import type { Express } from "express";
import authRouter from "./auth/routes";

export function createExpressApplication(): Express {
    const app = express();

    app.use(express.json({ limit: "60kb" }));

    app.use("/api/auth", authRouter);

    return app;
}
