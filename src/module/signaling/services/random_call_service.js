import { WaitingRoom } from '../models/waiting_room.js';
import { Rooms } from '../models/rooms.js';
import { CallHistory } from '../../call_history/models/call_history.js';
import { LiveUser } from '../models/live_users.js';
import { RoomsIds } from '../models/roomd_ids.js';


const createRoom = async function (userId, socketId) {
    try {
        const params = { userId: userId, socketId: socketId };
        const room = new Rooms(params);
        room.joinedUsers.push({ userId: userId, socketId: socketId, roomId: room.roomId });
        room.joinSize = room.joinedUsers.length;
        const proRes = await Promise.all([saveRooomId(userId, socketId, room.roomId), room.save()])
        return proRes[1];
    }
    catch (err) {
        throw err;
    }
}

const leaveRoom = async function (userId, roomId) {
    try {
        await Rooms.findOneAndUpdate(
            { roomId: roomId },
            {
                $pull: {
                    joinedUsers: { "userId": userId },
                },
                $inc: { joinSize: -1 }
            },
            { new: true }
        ).then((result) => {
            if (result.joinedUsers.length == 0) {
                Rooms.findOneAndDelete({ roomId: roomId })
                    .then(removedDocument => {
                        if (removedDocument) {
                            return removedDocument;
                        }
                    })
                    .catch(err => {
                        return null;
                    });
            }
            else {
                return null;
            }
        }).catch((err) => {
            return null;
        });
    }
    catch (e) {
        return callback({ message: "No room found", success: false, error: e }, null)
    }
}


const saveCallHistory = async (userId, otherUserId, roomId) => {
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


const createPairFromWaitingRoom = async (waitingRoom) => {
    for (const cc in waitingRoom) {
        joinRoom(global.mySocket, { userId: cc.userId, stateCode: cc.stateCode }, (error, res) => {
            if (error)
                return error;
            else return res
        });
    }
}

const createPairs = async (params, callback) => {
    try {
        const waitingRoom = await WaitingRoom.slice(0, 10);
        if (waitingRoom && waitingRoom.length >= 2) {
            const result = await createPairFromWaitingRoom(waitingRoom);
            if (result) {
                await WaitingRoom.deleteMany({}).limit(10);
                createPairs(params, callback);
            }
            else {
                return callback(null, {
                    message: "No one is in waitnig room",
                    error: false,
                });
            }
        }
        if (!waitingRoom) {
            return callback(null, {
                message: "No one is in waitnig room",
                error: false,
            });
        }
    }
    catch (e) {
        return callback(e, null);
    }
}


const callStared = async (params, callback) => {
    try {
        const { userId, otherUserId, roomId } = params;
        const cH = await CallHistory.findOneAndUpdate({ userId: userId }, { userId: userId });
        cH.history.push({ otherUserId: otherUserId, roomId: roomId },);
        cH.save();
        return callback(null, { message: "Call stared", error: false });
    }
    catch (e) {
        return callback(e, null);
    }
}

const clearRooms = async (params, callback) => {
    try {
        Rooms.deleteMany({}, function (err, result) {
            if (err) {
                return callback(err, null);
            }
            else {
                return callback(null, result);
            }
        });
    }
    catch (e) {
        return callback(e, null);
    }
}

const toggleOnline = async (params, callback) => {
    const { userId, online } = params;
    const options = { new: true, upsert: true };
    const filter = { userId: userId };
    const update = { online: online };
    try {
        await LiveUser.findOneAndUpdate(filter, update, options);
        return callback(null, { "message": "Status Changed" });
    }
    catch (_) {
        return callback(_, null);
    }
}

const joinWaitingRoom = async (userId, socketId, callback) => {
    const filter = { userId: userId };
    const update = { userId: userId, socketId: socketId, };
    const options = { new: true, upsert: true };
    try {
        const wrs = await WaitingRoom.findOneAndUpdate(filter, update, options);
        if (wrs) {
            return callback(wrs, null);
        }
        else {
            return callback({ message: "Connection not fodun" }, null);
        }
    }
    catch (e) {
        return callback(null, e);
    }
}

const joinAvailableRoom = async (socketId, userId) => {
    try {
        const roomRes = await Rooms.findOne({ joinSize: { $lt: 2 } });
        if (roomRes != null) {
            roomRes.joinedUsers.push({ userId: userId, roomId: roomRes.roomId, socketId: socketId });
            roomRes.joinSize = roomRes.joinedUsers.length;
            const proRes = await Promise.all([roomRes.save(), saveRooomId(userId, socketId, roomRes.roomId)]);
            return proRes[0];
        }
        else return null;
    }
    catch (err) {
        throw err;
    }
}

const leaveWaitingRoom = async (userId, callback) => {
    try {
        const filter = { userId: userId }
        const wr = await WaitingRoom.findOneAndDelete(filter);
        return callback(wr, null);
    }
    catch (err) {
        return callback(null, err);
    }
}

const getRoomIdByUserId = async (userId) => {
    if (userId) {
        const ids = await RoomsIds.findOneAndDelete({ userId: userId });
        if (ids)
            return ids.roomId;
        return null;
    }
    return null;
}

const getRoomIdBySocketId = async (socketId) => {
    if (socketId) {
        const ids = await RoomsIds.findOneAndRemove({ socketId: socketId });
        ids.roomId;
    }
    return null;
}
const saveRooomId = async (userId, socketId, roomId) => {
    const result = new RoomsIds({ userId: userId, socketId: socketId, roomId: roomId });
    return await result.save();
}

const SignalingService = {
    leaveRoom,
    clearRooms,
    callStared,
    saveCallHistory,
    toggleOnline,
    joinWaitingRoom,
    joinAvailableRoom,
    leaveWaitingRoom,
    getRoomIdByUserId,
    getRoomIdBySocketId,
    saveRooomId,
    createRoom
};
export { SignalingService }