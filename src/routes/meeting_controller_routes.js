import express from "express";
import { meetingControllers } from "../controller/call_controller.js";

const router = express.Router();

router.post("/joinRandomRoom", meetingControllers.joinRandomRoom)
router.get("/getAllUsers", meetingControllers.getAllMeetingUsersController);
router.post("/createRoom", meetingControllers.createRoomController);
router.post("/leaveRoom", meetingControllers.leaveRoomController);
router.post("/clearRooms", meetingControllers.clearRooms);
router.post("/callStarted", meetingControllers.callStarted);

export default router;