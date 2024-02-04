import express from "express";
import { VoiceCallController } from "../controller/call_history_controller.js";
const router = express.Router();

router.get("/call_history", VoiceCallController.getCallHistory);

export default router;