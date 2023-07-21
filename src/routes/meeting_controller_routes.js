import express from "express";
import { MeetingControllers } from "../controller/call_controller.js";

const router = express.Router();

router.post("/joinRandomRoom", MeetingControllers.joinRandomRoom)
router.post("/createRoom", MeetingControllers.createRoomController);
router.post("/leaveRoom", MeetingControllers.leaveRoomController);
router.post("/clearRooms", MeetingControllers.clearRooms);
router.post("/callStarted", MeetingControllers.callStarted);
router.post("/toggleOnline", MeetingControllers.toggleOnline);

export default router;