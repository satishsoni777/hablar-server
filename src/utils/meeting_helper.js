import { meetingServices } from "../service/meeting.service.js";
import { MeetingPayloadEnum } from "./meeting_payload_enums.js"


const joinMeeting = async function (meetingId, socket, meetingServer,payload, ) {
    const { userId, name } = payload;

    meetingServices.isMeetingPresent(meetingId, async (error, result) => {
        if (error && !result) {
            sendMessage(socket, {
                type: MeetingPayloadEnum.NOT_FOUND,
            })
        }
        if (result) {
            addUser(socket, { meetingId, userId, name }).then((result) => {
                if (result) {
                    sendMessage(socket, {
                        type: MeetingPayloadEnum.JOINED_MEETING,
                        data: {
                            userId
                        }
                    })
                    broadcastUser(meetingId, socket, meetingServer, {
                        type: MeetingPayloadEnum.USER_JOINED,
                        data: {
                            userId, name,
                            ...payload.data
                        }
                    })
                }
            }, (error) => {
                console.log(error);
            });
        }
    });
}

const addUser = function (socket, { meetingId, userId, name }) {
    let promise = new Promise(function (resolve, reject) {
        meetingServices.getMeetingUser({ meetingId, userId }, (error, result) => {
            if (!result) {
                var model = {
                    socketId: socket.id,
                    meetingId: meetingId,
                    userId: userId,
                    name: name,
                    joined: true,
                    isAlive: true
                };
                meetingServices.joinMeeting(model, (error, result) => {
                    if (result) {
                        resolve(true);
                    }
                    if (error) {
                        reject(error);
                    }
                })
            }
            else {
                meetingServices.updateMeetingUser({
                    userId: userId,
                    socketId: socket.id,


                }, (error, result) => {
                    if (result) {
                        resolve(true)
                    }
                    if (error) {
                        reject(error);
                    }
                })
            }
        })
    })
    return promise;
}


const forwardConnectionRequest = (meetingId, socket, meetingServer, payload) => {
    const { userId, otherUserId, name } = payload.data;
    var model = {
        meetingId: meetingId,
        userId: otherUserId,
    }
    meetingServices.getMeetingUser(model, (error, result) => {
        if (result) {
            var sendPayload = JSON.stringify({
                type: MeetingPayloadEnum.CONNECTION_REQUEST,
                userId,
                name,
                ...payload.data
            })
        }
        meetingServer.to(result.socketId).emit("message", sendPayload);
    })
}
const forwardIcCanidate = (meetingId, socket, meetingServer, payload) => {
    const { userId, otherUserId, canidate } = payload.data;
    var model = {
        meetingId: meetingId,
        userId: otherUserId,
    }
    meetingServices.getMeetingUser(model, (error, result) => {
        if (result) {
            var sendPayload = JSON.stringify({
                type: MeetingPayloadEnum.ICECANDIDATE,
                userId,
                canidate,
                ...payload.data
            })
        }
        meetingServer.to(result.socketId).emit("message", sendPayload);
    })
}
const forwardOfferSdp = (meetingId, socket, meetingServer, payload) => {
    const { userId, otherUserId, sdp } = payload.data;
    var model = {
        meetingId: meetingId,
        userId: otherUserId,
    }
    meetingServices.getMeetingUser(model, (error, result) => {
        if (result) {
            var sendPayload = JSON.stringify({
                type: MeetingPayloadEnum.OFFER_SDP,
                userId,
                sdp,
            })
        }
        meetingServer.to(result.socketId).emit("message", sendPayload);
    })
}
const forwardAnswerSDP = (meetingId, socket, meetingServer, payload) => {
    const { userId, otherUserId, sdp } = payload.data;
    var model = {
        meetingId: meetingId,
        userId: otherUserId
    }
    meetingServices.getMeetingUser(model, (error, result) => {
        if (result) {
            var sendPayload = JSON.stringify({
                type: MeetingPayloadEnum.ANSWER_SDP,
                userId,
                sdp,
            })
        }
        meetingServer.to(result.socketId).emit("message", sendPayload);
    })
}
const userLeft = (meetingId, socket, meetingServer, payload) => {
    const { userId } = payload.data;

    broadcastUser(meetingId, socket, meetingServer, {
        type: MeetingPayloadEnum.USER_LEFTL,
        data: {
            userId: userId
        }
    })
}
const meetingEnd = (meetingId, socket, meetingServer, payload) => {
    const { userId } = payload.data;

    broadcastUser(meetingId, socket, meetingServer, {
        type: MeetingPayloadEnum.MEETING_ENDED,
        data: {
            userId: userId
        }
    })
    meetingServices.getAllMeetingUsers(meetingId, (error, result) => {
        for (let i = 0; i < result.length; i++) {
            const meetingUser = result[i];
            meetingServer.sockets.connected(meetingUser.socketId).disconnect();
        }
    })
}
const forwardEvent = (meetingId, socket, meetingServer, payload) => {
    const { userId } = payload.data;

    broadcastUser(meetingId, socket, meetingServer, {
        type: payload.type,
        data: {
            userId: userId,
            ...payload.data
        }
    })
}

const broadcastUser = (meetingId, socket, meetingServer, payload) => {
    socket.broadcast.emit("message", JSON.stringify(payload));
}

function sendMessage(socket, payload) {
    socket.send(JSON.stringify(payload));
}
const meetingHelper = { joinMeeting, addUser, forwardConnectionRequest, forwardAnswerSDP, forwardIcCanidate, userLeft, forwardOfferSdp, forwardEvent,meetingEnd }

export { meetingHelper }