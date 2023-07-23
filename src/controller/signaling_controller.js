import { Rooms } from "../models/voice_stream/rooms.js";
import { RandomCallService } from "../service/random_call_service/random_call_service.js";
import { nanoid } from 'nanoid';
import { BaseController, HTTPFailureStatus } from '../webserver/base_controller.js';
import { UserSession } from "../../middleware/user_session.js";

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
    RandomCallService.joinRoom(req, (error, result) => {
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
    RandomCallService.leaveRoom(params, (error, result) => {
        if (error) {
            return next(error);
        }
        return baseController.successResponse(result, res);
    })
}

const clearRooms = (req, res) => {
    try {
        RandomCallService.clearRooms(req, (error, result) => {
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
        RandomCallService.callStared(req.body, (error, result) => {
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

const saveCallHistory = async (req, res) => {
    try {
        RandomCallService.saveCallHistory(req.body, (error, result) => {
            if (error) {
                return res.status(501).send(error);
            }
            return baseController.successResponse(result, res);
        })
    }
    catch (e) {
        return res.status(501).send(e);
    }
}

const toggleOnline = (req, res) => {
    try {
        req.body.userId = req.session.userId;
        RandomCallService.toggleOnline(req.body, (e, result) => {
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

const SignalingController = {
    createRoomController,
    joinRandomRoom,
    leaveRoomController,
    clearRooms,
    callStarted,
    saveCallHistory,
    toggleOnline
}

export { SignalingController }