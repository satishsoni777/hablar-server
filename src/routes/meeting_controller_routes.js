import express from "express";
import { meetingControllers } from "../controller/meeting_controller.js";

const router = express.Router();

router.post('/start', meetingControllers.startMeetingController);
router.post("/joinRoom", meetingControllers.joinMeetingController)
router.get("/get", meetingControllers.getAllMeetingUsersController);
router.post("/createRoom", meetingControllers.createRoomController);

export default router;