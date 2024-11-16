import { Router } from "express";
import * as chatController from "../controller/chat";

const chatRouter = Router();

chatRouter.get("/room", chatController.getOrCreateRoom);

chatRouter.post("/message", chatController.sendMessage);

chatRouter.get("/messages/:roomId", chatController.getMessages);

export default chatRouter;
