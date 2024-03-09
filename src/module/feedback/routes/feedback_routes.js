import express from "express";
import { FeedbackController } from "../controller/feedback_controller.js";
const router = express.Router();

router.post('/v1/sub_feedback', FeedbackController.submitFeedbackController)
router.get('/v1/feedback_list', FeedbackController.getFeedbacksCntr)

export default router;