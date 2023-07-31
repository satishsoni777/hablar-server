import { WaitingRoom } from '../../models/voice_stream/waiting_room.js';
import { Rooms } from '../../models/voice_stream/rooms.js';
import { CallHistory } from '../../models/users/call_history.js';
import { LiveUser } from '../../models/voice_stream/live_users.js';
import { Utils } from '../../utils/utils.js';

const joinRoom = async function (socketId, params, callback) {
    params.countryCode = "IN";
    const { userId } = params;
    let room;
    try {
        const result = await Rooms.findOneAndDelete({ hostId: userId });
        if (result) {
            return createRoom(socketId, params, callback);
        }
        else {
            const filter = {
                countryCode: "IN", joinedUserCount: { $in: [0, 1], }
            };
            room = await Rooms.find(filter);
        }
    }
    catch (err) {
        return callback(err, null)
    }

    if (room == null || room.length == 0) {
        return createRoom(socketId, params, callback);
    }
    else {
        room = Utils.shuffleArray(room)[0];
        if (room.joinedUserCount == 1 && room != null) {
            const { roomId } = room;
            params.roomId = room.roomId;
            params.socketId = socketId
            room.joinedUsers.push(params);
            room.roomId = roomId;
            let cH, cH2;
            // await createCallHistory(room);
            // cH = await CallHistory.findOne({ userId: room.joinedUsers[0].userId });
            // if (cH) {
            //     cH.history.push({ otherUserId: room.joinedUsers[1].userId, roomId: room.roomId });
            // }
            // else {
            //     cH = new CallHistory({ userId: room.joinedUsers[0].userId });
            //     cH.history.push({ otherUserId: room.joinedUsers[1].userId, roomId: room.roomId });
            // }
            // cH2 = await CallHistory.findOne({ userId: room.joinedUsers[1].userId });
            // if (cH2) {
            //     cH2.history.push({ otherUserId: room.joinedUsers[0].userId, roomId: room.roomId });
            // }
            // else {
            //     cH2 = new CallHistory({ userId: room.joinedUsers[1].userId });
            //     cH2.history.push({ otherUserId: room.joinedUsers[0].userId, roomId: room.roomId });
            // }
            // try {
            //     const [p1, p2] = await Promise.all([cH.save(), cH2.save()]);
            // }
            // catch (e) {
            //     return baseController.errorResponse(e, res);
            // }
            try {
                const result = await room.save();
                result.socketId = socketId;
                result.userId = userId;
                return callback(null, result)
            }
            catch (e) {
                return callback(e, null);
            }
        }
        else if (room.joinedUserCount >= 2 && room != null) {
            let socketId;
            room.joinedUsers.forEach((e) => {
                if (userId == e.userId) {
                    socketId = e.socketId;
                }
            });
            return callback(null, {
                "userId": userId,
                "createdAt": room.createdAt,
                "roomId": room.roomId,
                "joinedUserCount": 2,
                "socketId": socketId
            });
        }
        else {
            return createRoom(socketId, params, callback);
        }
    }
}

const createRoom = async function (socketId, params, callback) {
    try {
        const room = new Rooms(params);
        room.hostId = params.userId;
        params.roomId = room.roomId;
        if (socketId) {
            params.socketId = socketId
            room.socketId = socketId
        }
        room.joinedUsers.push(params);
        await room.save().then((result) => {
            return callback(null, result);
        }).catch((error) => {
            return callback(error, null);
        });
    }
    catch (err) {
        return callback(err, null);
    }
}

const leaveRoom = async function (params, callback) {
    const { roomId, userId } = params;
    try {
        await Rooms.findOneAndUpdate(
            { roomId: roomId },
            {
                $pull: {
                    joinedUsers: { "userId": userId }
                }
            },
            { new: true }
        ).then((result) => {
            if (result.joinedUsers.length == 0) {
                Rooms.findOneAndDelete({ roomId: roomId })
                    .then(removedDocument => {
                        if (removedDocument) {
                            return callback(null, removedDocument)
                        }
                    })
                    .catch(err => {
                        return callback(err, null)
                    });
            }
            else {
                return callback(null, result);
            }
        }).catch((err) => {
            return callback(err, null);
        });
    }
    catch (e) {
        return callback({ message: "No room found", success: false, error: e }, null)
    }
}

const createCallHistory = async (params, callback) => {
    const room = params;
    for (var i = 0; i < room.joinedUsers.length; i++) {
        const filter = { userId: room.joinedUsers[i].userId };
        const call = await CallHistory.findOneAndUpdate(filter,);
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
    console.log(params)
    try {
        await LiveUser.findOneAndUpdate({ userId: userId }, { online: online });
        return callback(null, { "message": "Status Changed" });
    }
    catch (_) {
        return callback(_, null);
    }
}

const RandomCallService = {
    joinRoom,
    leaveRoom,
    clearRooms,
    callStared,
    saveCallHistory,
    toggleOnline
};
export { RandomCallService }