import express from "express";
import type { Router } from "express";
import AuthenticationController from "./auth.controller";
import { restrictToAuthenticatedUser } from "./auth.middleware";
import validate from "../../common/middlewares/validate.middleware";
import * as schema from "./dto/auth.dto";

const authenticationController = new AuthenticationController();

const authRouter: Router = express.Router();

authRouter.post(
    "/sign-up",
    validate(schema.signupSchema),
    authenticationController.handleSignup.bind(authenticationController),
);

authRouter.post(
    "/sign-in",
    validate(schema.signinSchema),
    authenticationController.handleSignin.bind(authenticationController),
);

authRouter.get(
    "/me",
    restrictToAuthenticatedUser(),
    authenticationController.handleMe.bind(authenticationController),
);

export default authRouter;
