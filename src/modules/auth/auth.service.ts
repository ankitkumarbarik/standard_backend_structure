import { SignupDTO, SigninDTO } from "./dto/auth.dto";
import { db } from "../../common/db";
import { usersTable } from "../../common/db/schema";
import { eq } from "drizzle-orm";
import { generateSalt, hashPassword } from "../../common/utils/hash.utils";
import ApiError from "../../common/utils/api-error";
import { generateAccessToken } from "../../common/utils/jwt.utils";
import fs from "node:fs";
import ImageKit from "@imagekit/nodejs";
import imagekit from "../../common/config/image-kit.config";

export class AuthService {
    public async signup(data: SignupDTO) {
        const { firstName, lastName, email, password } = data;

        const existing = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email));

        if (existing.length > 0) {
            throw ApiError.conflict(`user with email ${email} already exists`);
        }

        const salt = generateSalt();
        const hash = hashPassword(password, salt);

        const [result] = await db
            .insert(usersTable)
            .values({
                firstName,
                lastName,
                email,
                password: hash,
                salt,
            })
            .returning({ id: usersTable.id });

        return { id: result?.id };
    }

    public async signin(data: SigninDTO) {
        const { email, password } = data;

        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email));

        if (!user) {
            throw ApiError.notFound(`user with email ${email} not found`);
        }

        const hash = hashPassword(password, user.salt!);

        if (user.password !== hash) {
            throw ApiError.unauthorized("invalid email or password");
        }

        const token = generateAccessToken({ id: user.id });

        return { token };
    }

    public async getMe(data: string) {
        const id = data;

        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, id));
        if (!user) throw ApiError.notFound(`user with id ${id} not found`);

        return user;
    }

    public async updateAvatar(data: string, file: Express.Multer.File) {
        const id = data;
        const { path } = file;

        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, id));
        if (!user) throw ApiError.notFound(`user with id ${id} not found`);

        const fileStream = fs.createReadStream(path);

        const params: ImageKit.FileUploadParams = {
            file: fileStream,
            fileName: file.filename,
            folder: "/user-avatars",
        };

        const response: ImageKit.FileUploadResponse =
            await imagekit.files.upload(params);

        const [result] = await db
            .update(usersTable)
            .set({ avatar: response.url })
            .where(eq(usersTable.id, id))
            .returning({ avatar: usersTable.avatar });

        fs.unlinkSync(path);

        return result?.avatar;
    }
}
