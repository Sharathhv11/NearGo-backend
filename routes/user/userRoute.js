import express from "express"
import createUser from "../../controllers/authentication/createUser.js";
import verifyEmail from "../../controllers/authentication/verifyEmail.js";
import login from "../../controllers/authentication/login.js";
import authorize from "../../controllers/authorization.js";
import { forgotPassword } from "../../controllers/authentication/password.js";
import { passwordResetClient, passwordResetServer } from "../../controllers/authentication/resetPassword.js";

const userRouter = express.Router();

userRouter.post("/sign-up",createUser);
userRouter.get("/verify/:token",verifyEmail);
userRouter.post("/login",login);
userRouter.get("/authorize",authorize);
userRouter.post("/forgot-password",forgotPassword);
userRouter.get("/reset-password/:token",passwordResetClient);
userRouter.post("/reset-password/:token",passwordResetServer);


export default userRouter;