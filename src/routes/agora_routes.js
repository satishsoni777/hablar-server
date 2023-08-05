import express from "express";

import { AgoraController } from '../controller/agora_controller.js';

const router = express.Router();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var APP_ID = "79e511b7bd03496ea13674e4409ca220";
// eslint-disable-next-line @typescript-eslint/no-unused-vars

router.get("/rtc_token", AgoraController.getAgoraToken);


// eslint-disable-next-line no-undef

export default router;