import express from "express";
import { FeedbackController } from "../controller/feedback_controller.js";
const router = express.Router();

router.post('/sub_feedback', FeedbackController.submitFeedbackController)
router.get('/getFeedbacks', FeedbackController.getFeedbacksCntr)
router.get('/feedback_list', FeedbackController.getFeedbacksCntr)

export default router;