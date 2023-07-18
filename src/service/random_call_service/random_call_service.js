import { WaitingRoom } from '../../models/voice_stream/waiting_room.js';
import { Rooms } from '../../models/voice_stream/rooms.js';
import { CallHistory } from '../../models/users/call_history.js';
import { LiveUser } from '../../models/voice_stream/live_users.js';


const joinRoom = async function (socket, params, callback) {
    console.log("Join room")
    params.countryCode = "IN";
    const { countryCode, stateCode, userId } = params;
    const filter = { stateCode: stateCode, joinedUserCount: { $in: [0, 1] } };
    const room = await Rooms.findOne(filter);
    if (room == null) {
        return createRoom(socket, params, callback);
    }
    else {

        // is Same user calling again same api
        if (room.hostId == userId) {
            return callback(null, {
                "userId": userId,
                "createdAt": room.createdAt,
                "roomId": room.roomId,
                "socketId": room.socketId
            });
        }
        if (room.joinedUserCount == 1 && room != null) {
            const { roomId } = room;
            params.roomId = room.roomId;
            params.socketId = socket.id;
            room.joinedUsers.push(params);
            room.roomId = roomId;
            let cH, cH2;
            cH = await CallHistory.findOne({ userId: room.joinedUsers[0].userId });
            if (cH) {
                cH.history.push({ otherUserId: room.joinedUsers[1].userId, roomId: room.roomId });
            }
            else {
                cH = await CallHistory({ userId: room.joinedUsers[0].userId });
                cH.history.push({ otherUserId: room.joinedUsers[1].userId, roomId: room.roomId });
            }
            cH2 = await CallHistory.findOne({ userId: room.joinedUsers[1].userId });
            console.log("CallHistory", cH2);
            if (cH2) {
                cH2.history.push({ otherUserId: room.joinedUsers[0].userId, roomId: room.roomId });
            }
            else {
                cH2 = await CallHistory({ userId: room.joinedUsers[1].userId });
                cH2.history.push({ otherUserId: room.joinedUsers[0].userId, roomId: room.roomId });
            }
            cH.save();
            cH2.save();
            room.save().then((r) => {
                r.socketId = socket.id;
                return callback(null, r);
            }).catch((e) => {
                return callback(e, null)
            });
        }
        else if (room.joinedUserCount >= 2 && room != null) {
            console.log("room.joinedUserCount", room.joinedUsers);


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
            return createRoom(params, callback);
        }
    }
}

const createRoom = async function (socket, params, callback) {
    try {
        const room = await Rooms(params);
        room.hostId = params.userId;
        params.roomId = room.roomId;
        if (socket) {
            params.socketId = socket.id;
            room.socketId = socket.id;
        }
        room.joinedUsers.push(params);
        room.save().then((result) => {
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
    const { userId, roomId } = params;
    const filter = { roomId: roomId };
    try {
        const room = await Rooms.findOne(filter);
        if (room != null) {
            if (room.joinedUsers.length >= 2) {
                const res = await saveCallHistory(params);
                if (res.error) {
                    return callback(null, res);
                }
                room.deleteOne({ roomId: roomId });
                return callback(null, {
                    message: "User left room",
                    success: true
                })
            }
            for (var i = 0; i < room.joinedUsers.length; i++) {
                if (room.joinedUsers[i].userId == userId) {
                    room.joinedUsers.id(room.joinedUsers[i]._id).remove();
                    room.save();
                    break;
                }
            }
        }
        if (room.joinedUsers.length == 0) {
            await room.deleteOne({ roomId: roomId });
        }
        else if (room.joinedUsers.length == 1) {
            if (room.hostId != room.joinedUsers[0].userId) {
                room.hostId = room.joinedUsers[0].userId;
                await room.save();
            }
        }

        return callback(null, {
            message: "User left room",
            success: true
        })
    }
    catch (e) {
        return callback({ message: "Unable to leave room", success: false, error: e }, null)
    }
}

const saveCallHistory = async (params) => {
    console.log("Save call hoist", params)
    const { userId, otherUserId, roomId } = params;
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
                const res = await WaitingRoom.deleteMany({}).limit(10);
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
        console.log("params ", params);
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
            console.log("asdfasdf", err, result);
            if (err)
                return callback(err, null);
            else return callback(null, result);
        });
    }
    catch (e) {
        return callback(e, null);
    }
}

const toggleOnline = async (params, callback) => {
    console.log("toggleOnline", params);
    const { userId, online } = params;
    try {
        const user = await LiveUser.findByIdAndUpdate({ userId: userId }, { online: online, userId: userId });
        return callback(null, { "message": "Status Changed" });
    }
    catch (_) {
        return callback(_, null);
    }
}


const meetingServices = {
    joinRoom,
    leaveRoom,
    clearRooms,
    callStared,
    saveCallHistory,
    toggleOnline
};
export {
    meetingServices
};