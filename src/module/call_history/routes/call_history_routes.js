import express from "express";
import { CallHistoryController } from "../controller/call_history_controller.js";
const router = express.Router();

router.get("/v1/call_history", CallHistoryController.getCallHistory);

export default router;