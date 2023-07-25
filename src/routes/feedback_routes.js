import express from "express";
import { FeedbackController } from "../controller/feedback_controller.js";
const router = express.Router();

router.post('/submit', FeedbackController.submitFeedbackController)
router.get('/getFeedbacks', FeedbackController.getFeedbacksCntr)
router.get('/get_feedbacks', FeedbackController.getFeedbacksCntr)

export default router;