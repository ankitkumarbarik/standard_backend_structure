import express from "express";
import type { Express } from "express";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "../modules/auth/auth.route";
import { authenticationMiddleware } from "../modules/auth/auth.middleware";
import { env } from "../env";
import errorMiddleware from "../common/middlewares/error.middleware";

export function createExpressApplication(): Express {
    const app = express();

    if (env.NODE_ENV === "production")
        app.use(
            compression({
                level: 6,
                threshold: 1024,
            }),
        );
    app.use(helmet());
    app.use(morgan("dev"));
    app.use(express.json({ limit: "16kb" }));
    app.use(express.urlencoded({ extended: true, limit: "16kb" }));
    app.use(express.static("public"));
    app.use(cookieParser());
    app.use(authenticationMiddleware());

    //#region  //*=========== Routes ===========
    app.use("/api/auth", authRouter);
    //#endregion  //*======== Routes ===========

    app.use(errorMiddleware);

    return app;
}
