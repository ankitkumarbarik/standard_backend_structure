import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import ApiResponse from "../../common/utils/api-response";
import type { TokenPayload } from "../../common/utils/jwt.utils";

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
}

export default AuthenticationController;
