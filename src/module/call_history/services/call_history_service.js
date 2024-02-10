import { CallHistory } from '../../call_history/models/call_history.js';
import { Users } from '../../users/models/users.js';

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
            error: e
        }, null);
    }
}
const saveCallHistory = async (params) => {
    const { userId, otherUserId, roomId } = params;
    console.log(params)
    try {
        const ch = await CallHistory.findOne({ userId: userId, "history.otherUserId": otherUserId, "history.roomId": roomId });
        const ch2 = await CallHistory.findOne({ userId: otherUserId, "history.otherUserId": userId, "history.roomId": roomId });

        ch.callEnd = true;
        if (ch && ch2) {
            ch.history.forEach((e) => {
                e.endTime = Date.now();
                e.duration = e.endTime.getTime() - e.startTime.getTime();
            });
            ch2.history.forEach((e) => {
                e.endTime = Date.now();
                e.duration = e.endTime.getTime() - e.startTime.getTime();
            });
            await ch.save();
            await ch2.save();

            return {
                message: "History saved",
                error: false
            };
        }
        return { message: "Error something went wrong", error: true };
    }
    catch (e) {
        return { message: "Error something went wrong", error: true, msg: e };
    }
}
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
export const CallHistoryService = {
    saveCallHistory,
    getCallHistory,
    getRecentCalls
};