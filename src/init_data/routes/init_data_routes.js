import express from "express";
import { InitDataController } from "../controller/init_data.controller.js";
const router = express.Router();

router.get('/v1/init_data', InitDataController.getInitData)

export default router;