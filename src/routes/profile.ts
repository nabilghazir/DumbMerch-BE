import { Router } from "express";
import * as profileController from "../controller/profile"
import { authentication } from "../middlewares/authentication";
import upload from "../middlewares/upload-file";

const profileRouter = Router();

profileRouter.put(
    "/update",
    upload.single("avatar"),
    profileController.updateProfile)

profileRouter.get("/get", profileController.getProfile)


export default profileRouter