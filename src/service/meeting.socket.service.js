import { meetingHelper } from "../utils/meeting_helper.js"
import { MeetingPayloadEnum } from "../utils/meeting_payload_enums.js"
import { LiveUsers } from "../models/live_users.js";

const parseMessage = (message) => {
    try {
        const payload = JSON.parse(message);
        return payload;
    }
    catch (error) {
        return { type: MeetingPayloadEnum.UNKNOWN };
    }
}

const listenMessage = (socket, meetingServer, io) => {
    socket.on("message", (message) => handleMessage(message, socket, meetingServer, io));
}

async function handleMessage(message, socket, meetingServer, io) {
    var payload = message;
    const roomId = message.roomId;
    const userId = socket.handshake.query.userId;
    console.log(message);
    switch (payload.type) {
        case MeetingPayloadEnum.JOIN_RANDOM_CALL:
            meetingHelper.joinRandomCall(message, socket);
            break;
        case MeetingPayloadEnum.JOIN_MEETING:
            meetingHelper.joinMeeting(roomId, socket, meetingServer, payload,);
            break;
        case MeetingPayloadEnum.CONNECTION_REQUEST:
            meetingHelper.forwardConnectionRequest(roomId, socket, payload,);
            break;
        case MeetingPayloadEnum.OFFER_SDP:
            meetingHelper.forwardOfferSdp(roomId, socket, payload, io);
            break;
        case MeetingPayloadEnum.ANSWER_SDP:
            meetingHelper.forwardAnswerSDP(roomId, socket, meetingServer, payload, io);
            break;
        case MeetingPayloadEnum.LEAVE_ROOM:
            meetingHelper.userLeft(message, socket, meetingServer, payload,);
            break;
        case MeetingPayloadEnum.END_MEETING:
            meetingHelper.meetingEnd(roomId, socket, meetingServer, payload,);
            break;
        case MeetingPayloadEnum.ICECANDIDATE:
            meetingHelper.forwardIcCanidate(roomId, socket, meetingServer, payload)
            break;
        case MeetingPayloadEnum.VIDEO_TOOGLE:
        case MeetingPayloadEnum.AUDIO_TOOGLE:
            break;
        case MeetingPayloadEnum.CHAT_MESSAGE:
            meetingHelper.sendMessageP2P(socket, meetingServer, payload,);
            meetingHelper.forE
            break;
        default:
            break;
    }
}

const saveUserSocketId = async (socket) => {
    const { userId } = socket.handshake.query;
    const user = await LiveUsers.findOne({ userId: userId });
    if (user == null) {
        const user = await LiveUsers({ socketId: socket.id, userId: userId, online: true });
        user.save();
    }
    else if (user) {
        user.socketId = socket.id;
        user.online = true;
        user.userId = userId;
        user.save();
        socket.emit("message", { "message": "Data saved" });
    }
}

const meetingServer = { listenMessage, saveUserSocketId };
export { meetingServer }
