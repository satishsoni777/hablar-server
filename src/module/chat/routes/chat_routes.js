import express from "express";
import { ChatController } from '../controller/chat_controller.js';

const router = express.Router();

router.post("/v1/sendMessage", ChatController.sendMessage)

router.post("/v1/send_message", ChatController.sendMessage)

export default router;

