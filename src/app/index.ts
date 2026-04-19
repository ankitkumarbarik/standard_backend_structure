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
import { upload } from "../common/middlewares/multer.middleware";
import ApiResponse from "../common/utils/api-response";
import fs from "node:fs";
import ApiError from "../common/utils/api-error";

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

    // multer is middleware. so ye aapke request pe .file - req.file attach kr deta h
    // User uploads file -> Multer middleware processes it -> saves file -> adds file info to req.file -> then controller accesses req.file

    // app.post("/upload", upload.single("file"), (req, res) => {
    //     console.log(req.file);
    //     ApiResponse.ok(res, "file uploaded", req.file);
    // });

    // what if the file will too large, so gere we can handle!!
    app.post("/upload", (req, res) => {
        upload.single("file")(req, res, (err) => {
            if (err?.code == "LIMIT_FILE_SIZE")
                ApiResponse.ok(res, "File too large");

            console.log(req.file);
            ApiResponse.ok(res, "file uploaded", req.file);
        });
    });

    // app.post('/upload', upload.single("file"), (req,res)=>{
    //     console.log(req.file)
    //     fs.writeFileSync("public/uploads/photo.png",req.file?.buffer!)
    //     ApiResponse.ok(res,"file uploaded",req.file)
    // })

    // app.post('/upload', upload.array("photos"), (req,res)=>{
    //     console.log(req.file)
    //     fs.writeFileSync("public/uploads/photo.png",req.file?.buffer!)
    //     ApiResponse.ok(res,"file uploaded",req.file)
    // })

    // app.post('/upload', upload.fields([{name:"avatar",maxCount:1},{name:"banner",maxCount:3}]), (req,res)=>{
    //     console.log(req.file)
    //     fs.writeFileSync("public/uploads/photo.png",req.file?.buffer!)
    //     ApiResponse.ok(res,"file uploaded",req.file)
    // })

    app.use(errorMiddleware);

    return app;
}
