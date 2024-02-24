import express from "express";
import { SignalingController } from "../controller/signaling_controller.js";

const router = express.Router();

router.post("/clear_rooms", SignalingController.clearRooms);

router.post("/call_started", SignalingController.callStarted);

router.post("/toggle_online", SignalingController.toggleOnline);

export default router;