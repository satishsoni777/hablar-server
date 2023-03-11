import { Rooms } from "../models/rooms.js";
import { meetingServices } from "../service/meeting.service.js";
import { nanoid } from 'nanoid';
import { Users } from "../models/users.js";
import { rmSync } from "fs";

// eslint-disable-next-line no-undef
const startMeetingController = (req, res, next) => {
    const { hostId, hostName } = req.body;
    var model = {
        hostId: hostId,
        hostName: hostName,
        startTime: Date.now()
    }
    meetingServices.startMeeting(model, (error, result) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            message: "Success",
            data: result.id
        })
    })
}

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

const joinMeetingController = (req, res, next) => {
    meetingServices.joinMeeting(req.body, (error, result) => {
        if (error) {
            return next(error);
        }
        console.log("Get all scores", result);
        return res.status(200).send({
            message: "Success",
            data: {
                emailId: req.body.emailId,
                createdAt: result.createdAt,
                roomId: req.body.roomId
            }
        })
    });
}

const meetingControllers = {
    createRoomController,
    joinMeetingController, startMeetingController,
    checkMeetingExistsController,
    getAllMeetingUsersController,
}

export { meetingControllers }