import { SignalingHelper } from "./signaling_helper.js"
import { MeetingPayloadEnum } from "../utils/meeting_payload_enums.js"

let pongReceived = false;
let pingTimeout;

const listenMessage = (socket, io) => {
    sendPing(socket, socket.handshake.query);
    socket.on(MeetingPayloadEnum.PING, (message) => {
        clearTimeout(pingTimeout);
        pongReceived = true;
        sendPing(socket, message);
        console.log("ping message", message)
    });
    socket.on("message", (message) => handleMessage(message, socket, io));
}

function sendPing(socket, message) {
    socket.emit(MeetingPayloadEnum.PONG, message)
    pongReceived = false;
    pingTimeout = setTimeout(() => {
        if (!pongReceived) {
            socket.disconnect(true); // Disconnect the socket with 'true' parameter, which means closing it gracefully
            console.log('User disconnected due to inactivity.');
        }
    }, 5000);
}

async function handleMessage(message, socket, io) {
    var payload = message;
    const roomId = message.roomId;
    const userId = socket.handshake.query.userId;
    payload.userId = userId;
    payload.roomId = roomId;
    switch (payload.type) {
        case MeetingPayloadEnum.JOIN_RANDOM_CALL:
            SignalingHelper.joinRandomCall(io, payload, socket);
            break;
        case MeetingPayloadEnum.JOIN_MEETING:
            break;
        case MeetingPayloadEnum.OFFER_SDP:
            SignalingHelper.forwardOfferSdp(roomId, socket, payload, io);
            break;
        case MeetingPayloadEnum.ANSWER_SDP:
            SignalingHelper.forwardAnswerSDP(socket, SocketService, payload, io);
            break;
        case MeetingPayloadEnum.LEAVE_ROOM:
            SignalingHelper.leaveRoom(io, socket, payload);
            break;
        case MeetingPayloadEnum.VIDEO_TOOGLE:
        case MeetingPayloadEnum.AUDIO_TOOGLE:
            break;
        case MeetingPayloadEnum.CHAT_MESSAGE:
            SignalingHelper.sendMessageP2P(socket, payload,);
            SignalingHelper.forE
            break;
        default:
            break;
    }
}
async function disconnect(socket, io) {

}
async function close(socket, io) {

}



// const liveUsers = async (socket, params) => {
//     params.online = socket.handshake.query.online
//     const { userId, online } = params;
//     const user = await LiveUser.findOneAndUpdate({ userId: userId }, { online: online });
//     if (user == null) {
//         const user = await LiveUser({ socketId: socket.id, userId: userId, online: true });
//         await user.save();
//     }
//     else if (user) {
//         user.socketId = socket.id;
//         user.online = online;
//         user.userId = userId;
//         await user.save();
//         socket.emit("message", { "message": "Data saved" });
//     }
// }

const SocketService = { listenMessage, disconnect, close };
export { SocketService }
