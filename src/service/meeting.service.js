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

const joinMeeting = async function (param, callback) {
    const room = new Rooms(param);
    console.log(room);
    const { roomId } = param.roomId;
    const filter = { roomId: roomId };
    const update = room.joinedUsers.push(room);
    try {
        const doc = await Rooms.findOneAndUpdate(filter, update, {
            new: true,
            upsert: true
        });
        return callback(null, doc)
    }
    catch (err) {
        return callback(err, null);
    }
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
const meetingServices = {
    startMeeting,
    joinMeeting,
    getAllMeetingUsers,
    isMeetingPresent,
    checkMeetingExists,
    getUserBySocketId,
    updateMeetingUser,
    getMeetingUser
};
export {
    meetingServices
};