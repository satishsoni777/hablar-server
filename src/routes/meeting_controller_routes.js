import express from "express";
import { meetingControllers } from "../controller/call_controller.js";

const router = express.Router();

router.post("/joinRandomRoom", meetingControllers.joinRandomRoom)
router.post("/createRoom", meetingControllers.createRoomController);
router.post("/leaveRoom", meetingControllers.leaveRoomController);
router.post("/clearRooms", meetingControllers.clearRooms);
router.post("/callStarted", meetingControllers.callStarted);
router.post("/toggleOnline", meetingControllers.toggleOnline);

export default router;