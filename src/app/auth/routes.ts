import express from "express";
import type { Router } from "express";
import AuthenticationController from "./controllers";

const authenticationController = new AuthenticationController();

const authRouter: Router = express.Router();

authRouter.post(
    "/sign-up",
    authenticationController.handleSignup.bind(authenticationController),
);

authRouter.post(
    "/sign-in",
    authenticationController.handleSignin.bind(authenticationController),
);

export default authRouter;
