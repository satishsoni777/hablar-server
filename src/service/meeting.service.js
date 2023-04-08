import { error } from 'console';
import { Meeting } from '../models/meeting.model.js';
import { MeetingUser } from '../models/meeting_user.model.js';
import { Rooms, JoinedUserModel } from '../models/rooms.js';


const getAllMeetingUsers = async function (meetId, callback) {
    MeetingUser.find({ meetingId: meetId }).then((response) => {
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

const joinRoom = async function (req, callback) {
    console.log("######### Meeting Service joinRoom ##########", req.body)
    const { countryCode, stateCode } = req.body;
    const filter = { stateCode: stateCode, joinedUserCount: 1 };
    const room = await Rooms.findOne(filter);
    if (room == null) {
        return createRoom(req.body, callback);
    }
    else {
        if (room.joinedUserCount == 1 && room != null) {
            const { roomId } = room;
            req.body.roomId=room.roomId;
            room.joinedUsers.push(req.body);
            room.roomId = roomId;
            room.save().then((r) => {
                return callback(null, r);
            }).catch((e) => {
                return callback(e, null)
            });
        } else {
            return createRoom(req.body, callback);
        }
    }
}

const createRoom = async function (params, callback) {
    try {
        console.log("######### create room ##########")
        const room = new Rooms(params);
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
    MeetingUser.updateOne({ userId: params.userId }, { $set: params }, { new: true })
        .then((response) => {
            return callback(null, response);
        }).catch((error) => {
            return callback(error)
        });
}

const getMeetingUser = async function (params, callback) {
    const { meetingId, userId } = params;

    MeetingUser.find({ meetingId, userId }).then((response) => {
        return callback(null, response);
    }).catch((error) => {
        return callback(error);
    })
}
const getUserBySocketId = async function (params, callback) {
    const { meetingId, socketId } = params;
    MeetingUser.find({ meetingId, socketId }).limit(1).then((response) => {
        return callback(null, response)
    }).catch((error) => {
        return callback(error);
    })
}

const leaveRoom = async function (params, callback) {
    const { roomId } = params.query;
    const { userId } = params.body;
    const filter = { roomId: roomId };
    var hasRemoved = false;
    Rooms.findOne(filter, function (e, r) {
        for (var i = 0; i < r.joinedUsers.length; i++) {
            if (r.joinedUsers[i].userId == userId) {
                hasRemoved = true;
                r.joinedUsers.id(r.joinedUsers[i]._id).remove();
                break;
            }
        }
        r.save().then((r) => {
            if (hasRemoved)
                return callback(null, {
                    success: true,
                    data: "User left"
                });
            else return callback(null, {
                success: false,
                data: "Could not found user"
            })
        }).catch((e) => {
            return callback(e, null);
        });
    })
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