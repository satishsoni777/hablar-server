import { Rooms } from "../models/voice_stream/rooms.js";
import { meetingServices } from "../service/call_service/random_call_service.js";
import { nanoid } from 'nanoid';


const checkMeetingExistsController = (req, res, next) => {
    const { meetingId } = req.query;

    meetingServices.checkMeetingExists(meetingId, (error, result) => {
        if (error)
            return next(error);
        return res.status(200).send({
            message: "Success",
            data: result.id
        })
    })
}

const getAllMeetingUsersController = (req, res, next) => {
    const { meetingId } = req.query;
    meetingServices.getAllMeetingUsers(meetingId, (error, result) => {
        if (error) {
            return next(error);
        }
        console.log("Get all scores", meetingId, result);
        return res.status(200).send({
            message: "Success",
            data: result.id
        })
    })
}

const createRoomController = async (req, res, next) => {
    const filter = { emailId: req.body.emailId };
    const update = { createdAt: new Date().toISOString(), roomId: nanoid(7), emailId: filter.emailId, };
    try {
        const doc = await Rooms.findOneAndUpdate(filter, update, {
            new: true,
            upsert: true
        });
        return res.status(200).send({
            success: true,
            data: {
                roomId: doc.roomId,
                emailId: doc.emailId,
                createdAt: update.createdAt
            }
        });
    }
    catch (e) {
        if (e.code == 11000) {
            const room = new Rooms(req.body);
            room.save();
            return res.status(200).send({
                success: true,
                data: {
                    roomId: room.roomId,
                    emailId: room.emailId,
                    createdAt: room.createdAt
                }
            });
        }
        else
            return res.status(400).send(e);
    }
}

const joinRandomRoom = (req, res, next) => {
    meetingServices.joinRoom(req, (error, result) => {
        if (error) {
            return res.status(501).send({
                success: false,
                error: error
            })
        }
        console.log("Get all scores", result.userId);
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
    console.log("### Leave room ###", req.body);
    meetingServices.leaveRoom(req.body, (error, result) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send(result);
    })
}

const clearRooms = async (req, res, next) => {
    console.log("### clearRooms all rooms ###");
    try {
        meetingServices.clearRooms(req, (error, result) => {
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
    console.log("### callStarted ###");
    try {
        meetingServices.callStared(req.body, (error, result) => {
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
        meetingServices.saveCallHistory(req.body, (error, result) => {
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

const meetingControllers = {
    createRoomController,
    joinRandomRoom,
    checkMeetingExistsController,
    getAllMeetingUsersController,
    leaveRoomController,
    clearRooms,
    callStarted,
    saveCallHistory
}

export { meetingControllers }