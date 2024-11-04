import { Router } from "express";
import * as authController from "../controller/auth"
import { authentication } from "../middlewares/authentication";

const authRouter = Router();

authRouter.post("/register", authController.register)

authRouter.post("/login", authController.login)

authRouter.get("/auth-check", authentication, authController.authCheck)

authRouter.get("/getalluser", authController.getAllUser)

export default authRouter