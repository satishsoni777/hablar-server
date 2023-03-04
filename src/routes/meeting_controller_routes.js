import express from "express";
import { meetingControllers } from "../controller/meeting_controller.js";

const router = express.Router();

router.post('/start', meetingControllers.startMeetingController);
router.get("/join", meetingControllers.checkMeetingExistsController)
router.get("/get", meetingControllers.getAllMeetingUsersController);

export default router;