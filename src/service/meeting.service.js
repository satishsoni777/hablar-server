import { error } from 'console';
import { Meeting } from '../models/meeting.model.js';
import { LiveUsers } from '../models/live_users.js';
import { Rooms, JoinedUserModel } from '../models/rooms.js';


const getAllMeetingUsers = async function (meetId, callback) {
    LiveUsers.find({ meetingId: meetId }).then((response) => {
        if (response.id != null)
            return callback(null, response);
        else {
            throw error;
        }
    }).catch((err) => {
        return callback(err)
    });
}

const startMeeting = async function (data, callback) {
    const meetingScheme = new Meeting(data);
    meetingScheme.save().then((response) => {
        return callback(null, response);
    }).then((err) => {
        return callback(err);
    })
}

const joinRoom = async function (params, callback) {
    const { countryCode, stateCode, userId } = params;
    const filter = { stateCode: stateCode, joinedUserCount: { $in: [0, 1, 2] } };
    const room = await Rooms.findOne(filter);
    console.log("######### Rooms is data  ##########")
    if (room == null) {
        return createRoom(params, callback);
    }
    else {
        // is Same user calling again same api
        if (room.hostId == userId) {
            return callback(null, {
                "userId": userId,
                "createdAt": room.createdAt,
                "roomId": room.roomId,
            });
        }
        if (room.joinedUserCount == 1 && room != null) {
            const { roomId } = room;
            params.roomId = room.roomId;
            room.joinedUsers.push(params);
            room.roomId = roomId;
            console.log("User count with more than 2 ")
            room.save().then((r) => {
                return callback(null, r);
            }).catch((e) => {
                return callback(e, null)
            });
        }
        else if (room.joinedUserCount >= 2 && room != null) {
            return callback(null, {
                "userId": userId,
                "createdAt": room.createdAt,
                "roomId": room.roomId,
                "joinedUserCount": 2
            });
        }
        else {
            return createRoom(params, callback);
        }
    }
}

const createRoom = async function (params, callback) {
    try {
        console.log("######### create room ##########", params)
        const room = new Rooms(params);
        room.hostId = params.userId;
        params.roomId = room.roomId;
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

const joinRoomWithRoomId = async function (params, callback) {
    var { roomId, data } = params;
    const { userId, countryCode } = data;
    const filter = { roomId: roomId };
    data.roomId = roomId;
    try {
        Rooms.findOne(filter).then((r) => {
            if (r != null) {
                for (var i = 0; i < r.joinedUsers.length; i++) {
                    if (r.joinedUsers[i].userId == userId) {
                        return callback(null, r);
                    }
                }
                r.joinedUsers.push(data)
                r.save().then((r) => {
                    return callback(null, r);
                }).catch((e) => {
                    return callback(e, null)
                });
            }
            else return callback("No room found", null);
        });
    }
    catch (e) {
        return callback({
            message: "No room found with given room id",
            success: false,
        }, null);
    }
}



const updateMeetingUser = async function (params, callback) {
    LiveUsers.updateOne({ userId: params.userId }, { $set: params }, { new: true })
        .then((response) => {
            return callback(null, response);
        }).catch((error) => {
            return callback(error)
        });
}

const getMeetingUser = function (params, callback) {
    const { otherUserId } = params;
    LiveUsers.findOne({ roomId: otherUserId }).then((response) => {
        return callback(null, response);
    }).catch((error) => {
        return callback(error);
    })
}
const getUserBySocketId = async function (params, callback) {
    const { meetingId, socketId } = params;
    LiveUsers.find({ meetingId, socketId }).limit(1).then((response) => {
        return callback(null, response)
    }).catch((error) => {
        return callback(error);
    })
}

const leaveRoom = async function (params, callback) {
    console.log("leave room {1}", params)
    const { userId, roomId } = params;
    const filter = { roomId: roomId };
    try {
        const room = await Rooms.findOne(filter);
        console.log("leave room", room.joinedUsers.length)
        if (room != null) {
            for (var i = 0; i < room.joinedUsers.length; i++) {
                console.log("i", room.joinedUsers[i].userId == userId);
                if (room.joinedUsers[i].userId == userId) {
                    room.joinedUsers.id(room.joinedUsers[i]._id).remove();
                    room.save();
                    break;
                }
            }
        }
        if (room.joinedUsers.length == 0) {
            room.deleteOne({ roomId: roomId });
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

const meetingServices = {
    startMeeting,
    joinRoom,
    getAllMeetingUsers,
    getUserBySocketId,
    updateMeetingUser,
    getMeetingUser,
    leaveRoom
};
export {
    meetingServices
};