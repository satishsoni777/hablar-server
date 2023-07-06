import { CallHistory } from '../../models/users/call_history.js';
import { Users } from '../../models/users/users.js';

const getCallHistory = async (params, callback) => {
    try {
        const { userId } = params;
        const data = await CallHistory.findOne({ userId: userId });
        if (data.history) {
            const userIds = data.history.map((e) => e.userId);
            const users = await Users.find({ userId: { $in: userIds } });
            const callHistoryWithUserDetails = data.history.map((call) => {
                const user = users.find((user) => user.userId === call.otherUserId);
                return {
                    otherUserId: call.otherUserId,
                    roomId: call.roomId,
                    startTime: call.startTime,
                    endTime: call.endTime,
                    duration: call.duration ?? 0,
                    name: user ? user.name : '',
                    image: user ? user.image : '',
                    userId: call.otherUserId,
                };
            });
            return callback(null, {
                data: callHistoryWithUserDetails
            });
        }
        else return callback({
            success: false,
            message: "No data found"
        }, null);
    }
    catch (e) {
        return callback({
            success: false,
            message: "Something went wrong",
        }, null);
    }
}
// Return last 10 calls
const getRecentCalls = async (params, callback) => {
    try {
        const { userId } = params;
        const data = await CallHistory.findOne({ userId: userId });
        if (data)
            return callback();
    }
    catch (_) {

    }
}
const voiceCallsHistory = { getCallHistory, };
export {
    voiceCallsHistory
};
