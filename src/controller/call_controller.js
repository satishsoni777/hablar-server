import { Rooms } from "../models/voice_stream/rooms.js";
import { RandomCallService } from "../service/random_call_service/random_call_service.js";
import { nanoid } from 'nanoid';
import { BaseController, HTTPFailureStatus } from '../webserver/base_controller.js';

const baseController = new BaseController();

const createRoomController = async (req, res, next) => {
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
        return res.status(200).send({
            success: true,
            data: {
                userId: req.body.userId,
                createdAt: result.createdAt,
                roomId: result.roomId,
            }
        })
    });
}

const leaveRoomController = async (req, res, next) => {
    RandomCallService.leaveRoom(req.body, (error, result) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send(result);
    })
}

const clearRooms = async (req, res, next) => {
    try {
        RandomCallService.clearRooms(req, (error, result) => {
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

const callStarted = async (req, res, next) => {
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
const saveCallHistory = async (req, res, next) => {
    try {
        RandomCallService.saveCallHistory(req.body, (error, result) => {
            if (error) {
                return res.status(501).send(error);
            }
            return res.status(200).send(result);
        })
    }
    catch (e) {
        return res.status(501).send(e);
    }
}
const toggleOnline = (req, res, next) => {
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

const MeetingControllers = {
    createRoomController,
    joinRandomRoom,
    leaveRoomController,
    clearRooms,
    callStarted,
    saveCallHistory,
    toggleOnline
}

export { MeetingControllers }