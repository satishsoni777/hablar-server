import { SignalingHelper } from "./signaling_helper.js"
import { MeetingPayloadEnum } from "../utils/meeting_payload_enums.js"
import { SignalingController } from "../module/signaling/controller/signaling_controller.js";

let pingPongTimeout = 6000;
let pingTimeout;

const listenMessage = (socket, io) => {
    // sendPing(socket);
    // receivePong(socket)
    socket.on("message", (message) => handleMessage(message, socket, io));
}

function sendPing(socket) {
    // Send a 'ping' message to the client
    socket.emit(MeetingPayloadEnum.PING);

    // Set a timeout to wait for 'pong' response
    pingTimeout = setTimeout(() => {
        socket.disconnect(true); // Disconnect the client if there's a timeout
    }, pingPongTimeout); // 5 seconds timeout
}

function receivePong(socket) {
    socket.on(MeetingPayloadEnum.PONG, () => {

        // Clear the timeout as the response was received
        clearTimeout(pingTimeout);

        // Schedule the next 'ping' message
        setTimeout(sendPing, pingPongTimeout); // Send a 'ping' every 5 seconds
    });
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
            leaveRoom(socket, io);
            break;
        case MeetingPayloadEnum.VIDEO_TOOGLE:
        case MeetingPayloadEnum.AUDIO_TOOGLE:
            break;
        case MeetingPayloadEnum.CHAT_MESSAGE:
            SignalingHelper.sendMessageP2P(socket, payload,);
            break;
        default:
            break;
    }
}

async function connection(userId) {
    SignalingController.toggleOnline(null, true, userId);
}

async function leaveRoom(socket, io) {
    const userId = socket.handshake.query.userId;
    var roomId;
    console.log("socket.handshake.query.userId", socket.handshake.query.userId)
    const prms = await Promise.all([SignalingController.toggleOnline(false, userId), SignalingController.getRoomIdByUserId(userId)]);
    console.log("promise result leave room", prms)
    if (prms)
        roomId = prms[1];
    if (roomId) {
        const result = await Promise.all([
            SignalingController.leaveRoom(io, userId, roomId),
            SignalingController.leaveWaitingRoom(io, userId),
        ]);
    }

}

function close(socket, io) {
    return leaveRoom(socket, io);
}

function disconnect(socket, io) {
    console.log("disconnect socket")
    return leaveRoom(socket, io)
}

const SocketService = { listenMessage, disconnect, close, connection };
export { SocketService }
