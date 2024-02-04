import { voiceCallsHistory } from "../../users/services/call_history.js";
import { BaseController, HTTPFailureStatus } from '../../../webserver/base_controller.js';
import { JwtUtil } from '../../../utils/jwt_util.js'
import { UserSession } from "../../../../middleware/user_session.js";

const baseController = new BaseController();

const getCallHistory = (req, res, next) => {
    try {
        const userId = UserSession.getUserId(req, res, next);
        voiceCallsHistory.getCallHistory({ userId: userId }, (error, result) => {
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

export const VoiceCallController = { getCallHistory }


