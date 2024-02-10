import { Rooms } from "../models/rooms.js";
import { SignalingService } from "../services/random_call_service.js";
import { nanoid } from 'nanoid';
import { BaseController, HTTPFailureStatus } from '../../../webserver/base_controller.js';
import { UserSession } from "../../../../middleware/user_session.js";
import { WaitingRoom } from "../models/waiting_room.js";
import { MeetingPayloadEnum } from "../../../utils/meeting_payload_enums.js";

const baseController = new BaseController();

const createRoomController = async (req, res) => {
    const filter = { emailId: req.body.emailId };
    const update = { createdAt: new Date().toISOString(), roomId: nanoid(7), emailId: filter.emailId, };
    try {
        const doc = await Rooms.findOneAndUpdate(filter, update, {
            new: true,
            upsert: true
        });
        return baseController.successResponse({
            roomId: doc.roomId,
            emailId: doc.emailId,
            createdAt: update.createdAt
        }, res,);
    }
    catch (e) {
        if (e.code == 11000) {
            const room = new Rooms(req.body);
            await room.save();
            return baseController.successResponse({
                roomId: room.roomId,
                emailId: room.emailId,
                createdAt: room.createdAt
            }, res,);
        }
        else {
            return baseController.errorResponse(e, res,);
        }
    }
}

const joinRandomRoom = (req, res) => {
    SignalingService.joinRoom(req, (error, result) => {
        if (error) {
            return res.status(501).send({
                success: false,
                error: error
            })
        }
        return baseController.successResponse({
            userId: req.body.userId,
            createdAt: result.createdAt,
            roomId: result.roomId,
        }, res);
    });
}

const leaveRoomController = (req, res, next) => {
    const params = {
        userId: UserSession.getUserId(req),
        otherUserId: req.body.otherUserId,
        roomId: req.body.roomId,
    };
    SignalingService.leaveRoom(params, (error, result) => {
        if (error) {
            return next(error);
        }
        return baseController.successResponse(result, res);
    })
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

const toggleOnline = (io, online, userId) => {
    try {
        const params = { online: online, userId: userId };
        SignalingService.toggleOnline(params, (e, result) => {
            if (e) {
                return baseController.errorResponse(e, res,
                    HTTPFailureStatus.BAD_REQUEST
                );
            }
            else {
                return baseController.successResponse(result, res);
            }
        });
    }
    catch (e) {
        return baseController.errorResponse(e, res,
            HTTPFailureStatus.INTERNAL_SERVER_ERROR
        );
    }
}

const createPairsAndJoinRoom = async (io, array) => {
    try {
        for (var index = 0; index < Math.floor(array.length / 2); index++) {
            const slice = array.slice(index, index + 2);
            const payload = { hostId: slice[0].userId, socketId: slice[0].socketId, roomId: nanoid(7), };

            const room = new Rooms(payload);
            var newSlice = [];
            slice.forEach(element => {
                newSlice.push({ userId: element.userId, socketId: element.socketId, roomId: payload.roomId });
            });

            room.joinedUsers = newSlice;
            await room.save().then((result) => {
            }).catch((error) => {
            });
            room.joinedUsers.forEach((e) => {
                io.to(e.socketId).emit(MeetingPayloadEnum.CALL_STARTED, room.joinedUsers, payload.roomId);
            });
        }
        return newSlice;
    }
    catch (e) {
        console.log(e);
        return false;
    }

}

const joinWaitingRoom = async (io, userId, socketId) => {
    SignalingService.joinWaitingRoom(userId, socketId, async (res, err) => {
        var wrs;
        try {
            var prms = await Promise.all([WaitingRoom.find({}, { _id: 0, userId: 1, socketId: 1, }).limit(100)]);
            wrs = prms[0];
            if (wrs.length >= 2) {
                const shuffleArrayData = shuffleArray(wrs);
                const result = await createPairsAndJoinRoom(io, shuffleArrayData);
                return result;
            }
        }
        catch (e) {
            console.log("sadfsadf", e)
            return null;
        }

    });
    return null;
}


const joinAvailableRoom = async (userId, socketId) => {
    const res = await SignalingService.joinAvailableRoom();
    if (res) {
        res.joinedUsers.push({ userId: userId, roomId: res.roomId, socketId: socketId });
        await res.save();
        return res;
    }
    return null;
}

const joinARoom = async (io, userId, socketId) => {
    const rms = await joinAvailableRoom(userId, socketId);
    if (!rms) {
        await SignalingController.joinWaitingRoom(io, userId, socketId);
    }
    else {
        io.to(socketId).emit(MeetingPayloadEnum.CALL_STARTED, rms.joinedUsers, rms.roomId);
    }

}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const SignalingController = {
    createRoomController,
    joinRandomRoom,
    leaveRoomController,
    clearRooms,
    callStarted,
    toggleOnline,
    joinWaitingRoom,
    createPairsAndJoinRoom,
    joinAvailableRoom,
    joinARoom,
}

export { SignalingController }