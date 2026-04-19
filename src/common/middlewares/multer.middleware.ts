import { Request } from "express";
import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import type { FileFilterCallback } from "multer";

const storage = multer.diskStorage({
    // destination: function (req: Request, file: Express.Multer.File, cb) {
    //     cb(null, "public/uploads");
    // },
    destination: function (req: Request, file: Express.Multer.File, cb) {
        const dir = "public/uploads";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req: Request, file: Express.Multer.File, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
});

// const storage = multer.memoryStorage();

const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
): void => {
    const allowed = ["image/png", "image/jpeg", "image/gif", "image/webp"];

    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("File type not supported"));
        // cb(new Error("File type not supported"),false);
    }
};

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter,
}); 

// MIME - Multipurpose Internet Mail Extensions, file type of file format ..
// type/sub-type -> application/json, image/png, image/jpeg, text/html
