import { meetingHelper } from "../../../websocket/voice_call_helper.js"
import { MeetingPayloadEnum } from "../../utils/meeting_payload_enums.js"
import { LiveUser } from "../../models/voice_stream/live_users.js";


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
            meetingHelper.joinRandomCall(io, message, socket);
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
            meetingHelper.leaveRoom(roomId, socket, meetingServer, payload,);
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

const liveUsers = async (socket) => {
    console.log("Live user function", socket.handshake.query);
    const { userId, online } = socket.handshake.query;
    const user = await LiveUser.findOneAndUpdate({ userId: userId }, { online: online });
    if (user == null) {
        const user = await LiveUser({ socketId: socket.id, userId: userId, online: true });
        await user.save();
    }
    else if (user) {
        user.socketId = socket.id;
        user.online = online;
        user.userId = userId;
        await user.save();
        socket.emit("message", { "message": "Data saved" });
    }
}

const meetingServer = { listenMessage, liveUsers };
export { meetingServer }