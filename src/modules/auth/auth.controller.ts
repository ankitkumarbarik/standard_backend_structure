import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import ApiResponse from "../../common/utils/api-response";
import type { TokenPayload } from "../../common/utils/jwt.utils";
import ApiError from "../../common/utils/api-error";

const authService = new AuthService();

class AuthenticationController {
    public async handleSignup(req: Request, res: Response) {
        const result = await authService.signup(req.body);

        ApiResponse.created(res, "User created successfully", result);
    }

    public async handleSignin(req: Request, res: Response) {
        const result = await authService.signin(req.body);

        ApiResponse.ok(res, "Signin successful", result);
    }

    public async handleMe(req: Request, res: Response) {
        const { id } = req.user as TokenPayload;
        const { firstName, lastName, email } = await authService.getMe(id);

        ApiResponse.ok(res, "User fetched", { firstName, lastName, email });
    }

    public async handleAvatar(req: Request, res: Response) {
        const { id } = req.user as TokenPayload;
        const file = req.file!;
        if (!file)
            throw ApiError.badRequest(
                "No file uploaded. please send file with field name avatar",
            );
        const avatar = await authService.updateAvatar(id, file);

        ApiResponse.ok(res, "Avatar updated successfully", {
            avatarUrl: avatar,
        });
    }
}

export default AuthenticationController;
