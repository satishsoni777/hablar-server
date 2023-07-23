import express from "express";
import { SignalingController } from "../controller/signaling_controller.js";

const router = express.Router();

router.post("/joinRandomRoom", SignalingController.joinRandomRoom)

router.post("/join_random_room", SignalingController.joinRandomRoom)

router.post("/createRoom", SignalingController.createRoomController);

router.post("/create_room", SignalingController.createRoomController);

router.post("/leaveRoom", SignalingController.leaveRoomController);

router.post("/leave_room", SignalingController.leaveRoomController);

router.post("/clearRooms", SignalingController.clearRooms);

router.post("/callStarted", SignalingController.callStarted);

router.post("/toggleOnline", SignalingController.toggleOnline);

router.post("/toggle_online", SignalingController.toggleOnline);

export default router;