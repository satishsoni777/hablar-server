import { SignalingService } from "../module/signaling/services/random_call_service.js";
import { MeetingPayloadEnum } from "../utils/meeting_payload_enums.js"
import { WaitingRoom } from "../module/signaling/models/waiting_room.js";
import { SocketIoHelper } from "../webserver/socket_io_helper.js";
import { SignalingController } from '../module/signaling/controller/signaling_controller.js'

const joinRandomCall = async (io, message, socket) => {
    const rms = await SignalingController.joinARoom(io, message.userId, socket.id);
}

const forwardConnectionRequest = (roomId, socket, payload) => {
    const { userId, otherUserId, name } = payload.data;
    var model = {
        roomId: roomId,
        userId: otherUserId,
    }
}

const forwardIcCanidate = (roomId, socket, payload) => {
    const { userId, otherUserId, canidate } = payload.data;
    var model = {
        roomId: roomId,
        userId: otherUserId,
    }
}

const forwardOfferSdp = async (roomId, socket, payload, io) => {
    const { userId, otherUserId, offer } = payload;
    const model = {
        roomId: roomId,
        otherUserId: otherUserId,
    }
    const result = await WaitingRoom.findOne({ userId: otherUserId });
    if (result) {
        var sendPayload = {
            type: MeetingPayloadEnum.ANSWER_SDP,
            userId,
            offer,
        };
    }
    if (result) {
        // send to all who joined room1 exlcude sender
        socket.broadcast.to(roomId).emit(MeetingPayloadEnum.ANSWER_SDP, sendPayload);
    }
    else {
        // send to all who joined room1 exlcude sender
        socket.broadcast.to(roomId).emit(MeetingPayloadEnum.ANSWER_SDP, { "message": "Not found", "error": true });
    }
}

const forwardAnswerSDP = (roomId, socket, payload) => {
    const { userId, otherUserId, sdp, answer } = payload;
    var model = {
        roomId: roomId,
        userId: otherUserId
    }
}

const leaveRoom = (io, payload) => {
    const { userId, roomId } = payload;
    SignalingService.leaveRoom(payload, (error, result) => {
        if (error) {
            const payload = {
                payload: { userId: userId },
                roomId: roomId
            }
            SocketIoHelper.ioToAllClinetsInARooom(io, MeetingPayloadEnum.ERROR, payload)
        }
        else {
            const payload = { payload: userId, roomId: roomId }
            SocketIoHelper.ioToAllClinetsInARooom(io, MeetingPayloadEnum.USER_LEFTL, payload)
        }
    });
}

const forwardEvent = (roomId, socket, payload) => {
    const { userId } = payload.data;
    broadcastUser(roomId, socket, {
        type: payload.type,
        data: {
            userId: userId,
            ...payload.data
        }
    })
}

const broadcastUser = async (roomId, socket, payload) => {
    socket.broadcast.to(roomId).emit(payload.type, JSON.stringify(payload));
}

function sendMessage(socket, payload) {
    socket.send(JSON.stringify(payload));
}

function sendMessageP2P(socket, payload) {
    to(socket, payload);
}

function to(socket, payload) {
    socket.to(socket.socketId).emit("message", payload);
}

const SignalingHelper = {
    joinRandomCall,
    sendMessageP2P,
    forwardConnectionRequest,
    forwardAnswerSDP,
    forwardIcCanidate,
    leaveRoom,
    forwardOfferSdp,
    forwardEvent,
}

export { SignalingHelper }