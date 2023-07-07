import { voiceCallsHistory } from "../service/call_service/call_history.js";
import { BaseController, HTTPFailureStatus } from '../webserver/base_controller.js';

const baseController = new BaseController();
const getCallHistory = (req, res, next) => {
    try {
        voiceCallsHistory.getCallHistory(req.query, (error, result) => {
            if (error) {
                return baseController.errorResponse(error, res);
            }
            return baseController.successResponse(result, res);
        });
    }
    catch (e) {
        return baseController.errorResponse(e, res, HTTPFailureStatus.INTERNAL_SERVER_ERROR);
    }
}

const VoiceCallController = { getCallHistory }

export { VoiceCallController }

