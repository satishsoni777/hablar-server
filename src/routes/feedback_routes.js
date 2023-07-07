import express from "express";
import { FeedbackController } from "../controller/feed_back.js";
const router = express.Router();

router.post('/submit', FeedbackController.submitFeedbackController)
router.get('/getFeedbacks', FeedbackController.getFeedbacksCntr)

export default router;