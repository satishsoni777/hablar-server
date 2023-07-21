import { MeetingHelper } from "../../../websocket/voice_call_helper.js"
import { MeetingPayloadEnum } from "../../utils/meeting_payload_enums.js"
import { LiveUser } from "../../models/voice_stream/live_users.js";

const listenMessage = (socket, server, io) => {
    socket.on("ping", (message) => {

    });
    socket.on("message", (message) => handleMessage(message, socket, io));
}

async function handleMessage(message, socket, io) {
    var payload = message;
    const roomId = message.roomId;
    switch (payload.type) {
        case MeetingPayloadEnum.JOIN_RANDOM_CALL:
            message.userId = socket.handshake.query.userId;
            MeetingHelper.joinRandomCall(io, message, socket);
            break;
        case MeetingPayloadEnum.JOIN_MEETING:
            break;
        case MeetingPayloadEnum.CONNECTION_REQUEST:
            MeetingHelper.forwardConnectionRequest(roomId, socket, payload,);
            break;
        case MeetingPayloadEnum.OFFER_SDP:
            MeetingHelper.forwardOfferSdp(roomId, socket, payload, io);
            break;
        case MeetingPayloadEnum.ANSWER_SDP:
            MeetingHelper.forwardAnswerSDP(roomId, socket, MeetingServer, payload, io);
            break;
        case MeetingPayloadEnum.LEAVE_ROOM:
            MeetingHelper.leaveRoom(roomId, socket, payload,);
            break;
        case MeetingPayloadEnum.END_MEETING:
            MeetingHelper.meetingEnd(roomId, socket, payload,);
            break;
        case MeetingPayloadEnum.ICECANDIDATE:
            MeetingHelper.forwardIcCanidate(roomId, socket, payload)
            break;
        case MeetingPayloadEnum.VIDEO_TOOGLE:
        case MeetingPayloadEnum.AUDIO_TOOGLE:
            break;
        case MeetingPayloadEnum.CHAT_MESSAGE:
            MeetingHelper.sendMessageP2P(socket, payload,);
            MeetingHelper.forE
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

const MeetingServer = { listenMessage, liveUsers };
export { MeetingServer }
