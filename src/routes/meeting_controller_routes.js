import express from "express";
import { meetingControllers } from "../controller/meeting_controller.js";

const router = express.Router();

router.post('/start', meetingControllers.startMeetingController);
router.post("/joinRandomRoom", meetingControllers.joinRandomRoom)
router.get("/get", meetingControllers.getAllMeetingUsersController);
router.post("/createRoom", meetingControllers.createRoomController);
router.post("/leaveRoom",meetingControllers.leaveMeetingController);

export default router;