import { Rooms } from "../models/rooms.js";
import { RoomsIds } from "../models/roomd_ids.js";
import { SignalingService } from "../services/random_call_service.js";
import { nanoid } from 'nanoid';
import { BaseController } from '../../../webserver/base_controller.js';
import { WaitingRoom } from "../models/waiting_room.js";
import { MeetingPayloadEnum } from "../../../utils/meeting_payload_enums.js";
import { SocketIoHelper } from "../../../webserver/socket_io_helper.js";

const baseController = new BaseController();

const leaveRoom = async (io, userId, roomId) => {
    const params = { userId: userId, roomId: roomId }
    const leaveRes = await SignalingService.leaveRoom(userId, roomId);
    if (leaveRes != null) {
        SocketIoHelper.ioToAllClinetsInARooom(io, MeetingPayloadEnum.ERROR, params)
    }
    if (leaveRes)
        leaveRes.joinedUsers.forEach((e) => {
            if (e.userId != userId) {
                params.userId = e.userId;
            }
        })
    // Send notification to other user
    SocketIoHelper.ioToAllClinetsInARooom(io, MeetingPayloadEnum.USER_LEFTL, params)
}

const clearRooms = (req, res) => {
    try {
        SignalingService.clearRooms(req, (error, result) => {
            if (error) {
                return baseController.errorResponse(error, res);
            }
            return baseController.successResponse(result, res);
        })
    }
    catch (e) {
        res.status(501).send(e);
    }
}

const callStarted = (req, res) => {
    try {
        SignalingService.callStared(req.body, (error, result) => {
            if (error) {
                return res.status(501).send(error);
            }
            return res.status(200).send(result);
        })
    }
    catch (e) {
        res.status(501).send(e);
    }
}

const toggleOnline = (online, userId) => {
    try {
        const params = { online: online, userId: userId };
        SignalingService.toggleOnline(params, (e, result) => {
            if (e) {
                return e;
            }
            else {
                return result;
            }
        });
    }
    catch (e) {
        return e;
    }
}

const createPairsAndJoinRoom = async (io, array) => {
    try {
        for (var index = 0; index < Math.floor(array.length / 2); index++) {
            const slice = array.slice(index, index + 2);
            const payload = { userId: slice[0].userId, socketId: slice[0].socketId, roomId: nanoid(7), };
            const room = new Rooms(payload);
            var rmids;
            var newSlice = [];

            slice.forEach(element => {
                rmids = new RoomsIds({ userId: element.userId, socketId: element.socketId, roomId: payload.roomId });
                rmids.save();
                newSlice.push({ userId: element.userId, socketId: element.socketId, roomId: payload.roomId });
            });

            room.joinedUsers = newSlice;
            await Promise.all([room.save()]);
            room.joinedUsers.forEach((e) => {
                io.to(e.socketId).emit(MeetingPayloadEnum.CALL_STARTED, room.joinedUsers, e.roomId);
            });
        }
        return newSlice;
    }
    catch (e) {
        return false;
    }

}

const joinWaitingRoom = async (io, userId, socketId) => {
    SignalingService.joinWaitingRoom(userId, socketId, async (res, err) => {
        var wrs;
        try {
            var prms = await Promise.all([WaitingRoom.findOneAndRemove({}, { _id: 0, userId: 1, socketId: 1, }).limit(2)]);
            console.log("join watinr rom", prms)
            wrs = prms[0];
            if (wrs.length >= 2) {
                const shuffleArrayData = shuffleArray(wrs);
                const result = await createPairsAndJoinRoom(io, shuffleArrayData);
                return result;
            }
        }
        catch (e) {
            return null;
        }

    });
    return null;
}


const joinARoom = async (io, userId, socket) => {
    // check if rooms available 
    const joinAvailableRoomRes = await SignalingService.joinAvailableRoom(socket.id, userId);
    if (joinAvailableRoomRes) {
        if (joinAvailableRoomRes.joinedUsers.length >= 2) {
            socket.join(joinAvailableRoomRes.roomId)
            SocketIoHelper.ioToAllClinetsInARooom(io, MeetingPayloadEnum.CALL_STARTED, { roomId: joinAvailableRoomRes.roomId, payload: joinAvailableRoomRes.joinedUsers })
        }
        return joinAvailableRoomRes;
    }
    if (joinAvailableRoomRes == null) {
        try {
            //if no rooms available 
            const createRoomRes = await SignalingService.createRoom(userId, socket.id)
            if (createRoomRes == null)
                return null;
            socket.join(createRoomRes.roomId)
            return createRoomRes;
        }
        catch (err) {
            return err;
        }
    }
    return null;
}

const leaveWaitingRoom = async (io, userId) => {
    SignalingService.leaveWaitingRoom(userId, (res, err) => {
    });
}

const getRoomIdByUserId = async (userId) => {
    return await SignalingService.getRoomIdByUserId(userId);
}

const getRoomIdBySocketId = async (socketId) => {
    return SignalingService.getRoomIdBySocketId(socketId);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}



const SignalingController = {
    leaveRoom,
    clearRooms,
    callStarted,
    toggleOnline,
    joinWaitingRoom,
    createPairsAndJoinRoom,
    joinARoom,
    leaveWaitingRoom,
    getRoomIdByUserId,
    getRoomIdBySocketId,
}

export { SignalingController }