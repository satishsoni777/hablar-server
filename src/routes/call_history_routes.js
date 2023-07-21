import express from "express";
import { VoiceCallController } from "../controller/call_history_controller.js";
import { EndPoints } from "./endpoint.js";
const router = express.Router();

router.get(EndPoints.CallHistory, VoiceCallController.getCallHistory);

router.get('/', function (req, res) {
  res.send({
    message: "Greate, API is Under Dev."
  })
});

export default router;