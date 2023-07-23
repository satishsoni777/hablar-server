import express from "express";
import { ChatController } from '../controller/chat_controller.js';

const router = express.Router();

router.post("/sendMessage", ChatController.sendMessage)

router.post("/send_message", ChatController.sendMessage)

export default router;

