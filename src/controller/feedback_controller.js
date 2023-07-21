import { BaseController, HTTPFailureStatus } from "../webserver/base_controller.js";
import { feedbackService } from "../service/feedback/feedback_service.js";

const baseController = new BaseController();

const submitFeedbackController = async (req, res, next) => {
    try {
        feedbackService.submitFeedback(req.body, (error, result) => {
            if (error) {
                return baseController.errorMessage(error, res, HTTPFailureStatus.BAD_REQUEST);
            }
            return baseController.successResponse(result, res);
        });
    }
    catch (e) {
        return baseController.errorResponse(e, res);
    }
}
const getFeedbacksCntr = async (req, res, next) => {
    try {
        feedbackService.getFeedbacks(req.query, (error, result) => {
            if (error) {
                return baseController.errorMessage(error, res, HTTPFailureStatus.BAD_REQUEST);
            }
            return baseController.successResponse(result, res);
        });
    }
    catch (e) {
        return baseController.errorResponse(e, res);
    }
}

const FeedbackController = { submitFeedbackController, getFeedbacksCntr };
export { FeedbackController };