import express from "express";
import { SignalingController } from "../controller/signaling_controller.js";

const router = express.Router();

router.post("/v1/clear_rooms", SignalingController.clearRooms);

router.post("/v1/call_started", SignalingController.callStarted);

router.post("/v1/toggle_online", SignalingController.toggleOnline);

export default router;