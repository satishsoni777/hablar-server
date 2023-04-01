import { error } from 'console';
import { Meeting } from '../models/meeting.model.js';
import { MeetingUser } from '../models/meeting_user.model.js';
import { Rooms } from '../models/rooms.js';


const getAllMeetingUsers = async function (meetId, callback) {
    MeetingUser.find({ meetingId: meetId }).then((response) => {
        console.log(response);
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

const joinMeeting = async function (req, callback) {
    console.log(req.query);
    const filter = { countryCode: req.body.countryCode, stateCode: req.body.stateCode };
    const user = await Rooms.findOne(filter)
    if (!user && req.query.roomId == null) {
        return createRoom(req.body, callback);
    }
    else {
        const roomId = req.query.roomId;
        return joinRoomWithRoomId({ roomId: roomId, data: req.body }, callback);
    }
}

const createRoom = async function (params, callback) {
    try {
        console.log("### createRoom ####");
        const room = new Rooms(params);
        room.joinedUsers.push(room);
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
    const { roomId, data } = params;
    const filter = { roomId: roomId };
    const newUser = Rooms(data.body);
    console.log(newUser);
    Rooms.findOne(filter).then((r) => {
        r.joinedUsers.push(newUser);
        r.save().then((r) => {
            return callback(null, r);
        }).catch((e) => {
            return callback(e, null)
        });
        // room.updateOne(update).then((r) => {
        //     return callback(null, r);
        // }).catch((e) => {
        //     return (e, null);
        // });
    });
}

const isMeetingPresent = async function (meetingId, callback) {
    Meeting.findById("meetingId").populate("MeetingUser", "MeetingUser").then((response) => {
        if (!response)
            callback("Invalid meeting id")
        else callback(null, response);
    })
        .catch((err) => {
            return callback(err, false)
        })

}

const checkMeetingExists = async function (meetingId, callback) {
    console.log("Check meeting exists", meetingId);
    Meeting.findById(meetingId, "hostId, hostName,startTime").then((response) => {
        if (!response) {
            callback("Invalid meeting id")
        }
        else callback(null, response);
    })
        .catch((err) => {
            return callback(err, false)
        })
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
    const { emailId, roomId } = params;
    const filter = { roomId: roomId, emailId: emailId };
    Rooms.deleteOne(filter).then((result) => {
        return callback(null, result);
    }).catch((error) => {
        return callback(error, null);
    });

}
const meetingServices = {
    startMeeting,
    joinMeeting,
    getAllMeetingUsers,
    isMeetingPresent,
    checkMeetingExists,
    getUserBySocketId,
    updateMeetingUser,
    getMeetingUser,
    leaveRoom
};
export {
    meetingServices
};