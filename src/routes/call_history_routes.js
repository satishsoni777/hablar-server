import express from "express";
import { VoiceCallController } from "../controller/call_history_controller.js";
const router = express.Router();

router.get("/call_history", VoiceCallController.getCallHistory);

router.get('/', function (req, res) {
  res.send({
    message: "Greate, API is Under Dev."
  })
});

export default router;