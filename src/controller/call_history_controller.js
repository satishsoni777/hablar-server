import { voiceCallsHistory } from "../service/call_service/call_history.js";

const getCallHistory = (req, res, next) => {
    try {
        voiceCallsHistory.getCallHistory(req.query, (error, result) => {
            if (error) {
                return res.status(401).send(error);
            }
            return res.status(200).send(result);
        });
    }
    catch (_) {
        return res.status(501).send({
            message: "Something went wrong",
            error: true
        });
    }
}

const VoiceCallController = { getCallHistory }

export { VoiceCallController }

