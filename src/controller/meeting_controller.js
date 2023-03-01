import {meetingServices} from "../service/meeting.service.js";
// eslint-disable-next-line no-undef
 const startMeetingController = (req, res, next) =>{
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
const checkMeetingExistsController = (req, res, next)=> {
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
const  getAllMeetingUsersController=(req, res, next) =>{
    const { meetingId } = req.query;
    meetingServices.getAllMeetingUsers(meetingId, (error, result) => {
        if (error) {
            return next(error);
        }
        console.log("Get all scores",meetingId,result);
        return res.status(200).send({
            message: "Success",
            data: result.id
        })
    })
}

 export const meetingControllers={startMeetingController, checkMeetingExistsController, getAllMeetingUsersController, }