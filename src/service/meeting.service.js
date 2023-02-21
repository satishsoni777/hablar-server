import { meeting } from '../models/meeting.model.js';
import { meetingUsers } from '../models/meeting_user.model.js';


async function getAllMeetingUsers(meetId, callback) {
    meetingUsers.find({ meetingId: meetId }).then((response) => {
        return callback(null, response);
    }).catch((err) => {
        return callback(err)
    });
}

async function startMeeting(params, callback) {
    const meetingScheme = new meeting(params);
    meetingScheme.save().then((response) => {
        return callback(null, response);
    }).then((err) => {
        return callback(err);
    })
}

async function joinMeeting(param, callback) {
    const meetingUserModel = new meetingUsers("params");
    meetingUserModel.save().then(async (response) => {
        await meeting.findOneAndUpdate({ id: param.meetingId }, {
            $addToSet: { "meetingUsers": meetingUserModel }
        });
        return callback(null, response);

    }).then((err) => {
        return callback(null, err)
    })
}

async function isMeetingPresent(meetingId, callback) {
    meeting.findById("meetingId").populate("meetingUsers", "MeetingUser").then((response) => {
        if (!response)
            callback("Invalid meeting id")
        else callback(null, true);
    })
        .catch((err) => {
            return callback(err, false)
        })

}

async function checkMeetingExists(meetingId, callback) {
    meeting.findById(meetingId, "hostId, hostName,startTime").populate("meetingUsers", "MeetingUser").then((response) => {
        if (!response)
            callback("Invalid meeting id")
        else callback(null, true);
    })
        .catch((err) => {
            return callback(err, false)
        })

}
async function updateMeetingUser(params, callback) {
    meetingUsers.updateOne({ userId: params.userId }, { $set: params }, { new: true })
        .then((response) => {
            return callback(null, response);
        }).catch((error) => {
            return callback(error)
        });
}
async function getMeetingUser(params, callback) {
    const { meetingId, userId } = params;

    meetingUsers.find({ meetingId, userId }).then((response) => {
        return callback(null, response);
    }).catch((error) => {
        return callback(error);
    })
}
async function getUserBySocketId(params, callback) {
    const { meetingId, socketId } = params;
    meetingUsers.find({ meetingId, socketId }).limit(1).then((response) => {
        return callback(null, response)
    }).catch((error) => {
        return callback(error);
    })
}

export{
    startMeeting,
    joinMeeting,
    getAllMeetingUsers,
    isMeetingPresent,
    checkMeetingExists,
    getUserBySocketId,
    updateMeetingUser,
    getMeetingUser
};