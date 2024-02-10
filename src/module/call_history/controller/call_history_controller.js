
import { BaseController, HTTPFailureStatus } from '../../../webserver/base_controller.js';
import { UserSession } from "../../../../middleware/user_session.js";
import { CallHistoryService } from '../services/call_history_service.js'

const baseController = new BaseController();

const getCallHistory = (req, res, next) => {
    try {
        const userId = UserSession.getUserId(req, res, next);
        CallHistoryService.getCallHistory({ userId: userId }, (error, result) => {
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

const saveCallHistory = async (req, res) => {
    try {
        CallHistoryService.saveCallHistory(req.body, (error, result) => {
            if (error) {
                return res.status(501).send(error);
            }
            return baseController.successResponse(result, res);
        })
    }
    catch (e) {
        return res.status(501).send(e);
    }
}

export const CallHistoryController = { getCallHistory, saveCallHistory }


