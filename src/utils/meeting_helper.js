import { meetingServices } from "../service/meeting.service.js";
import { MeetingPayloadEnum } from "./meeting_payload_enums.js"
import { meetingControllers } from "../controller/meeting_controller.js";
import { LiveUsers } from "../models/live_users.js";
import { Rooms } from "../models/rooms.js";

const joinMeeting = async function (roomId, socket, meetingServer, payload,) {
    const { userId, name } = payload;

    meetingServices.isMeetingPresent(roomId, async (error, result) => {
        if (error && !result) {
            sendMessage(socket, {
                type: MeetingPayloadEnum.NOT_FOUND,
            })
        }
        if (result) {
            addUser(socket, { roomId, userId, name }).then((result) => {
                if (result) {
                    sendMessage(socket, {
                        type: MeetingPayloadEnum.JOINED_MEETING,
                        data: {
                            userId
                        }
                    })
                    broadcastUser(roomId, socket, {
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

const joinRandomCall = async (io, message, socket) => {
    const params = message;
    console.log("Join random call {3}", message);
    meetingServices.joinRoom(socket, params, (error, result) => {
        if (error) {
            socket.emit(MeetingPayloadEnum.USER_JOINED, {
                success: false,
                error: error
            });
        }
        else {
            socket.join(result.roomId);
            if (result.joinedUserCount == 2) {
                console.log("socket braod cast socket2 id", result.socketId);
                io.to(result.socketId).emit(MeetingPayloadEnum.JOIN, {
                    userId: result.userId,
                    roomId: result.roomId,
                    createdAt: result.createdAt,
                    joinedUserCount: result.joinedUserCount,
                });
            }
            else {
                console.log("socket braod cast socket1 id", result.socketId);
                io.to(result.socketId).emit(MeetingPayloadEnum.CREATE_ROOM, {
                    userId: result.userId,
                    roomId: result.roomId,
                    createdAt: result.createdAt,
                    joinedUserCount: result.joinedUserCount
                });
            }
        }
    });
}

const addUser = function (socket, { roomId, userId, name }) {
    let promise = new Promise(function (resolve, reject) {
        meetingServices.getMeetingUser({ roomId, userId }, (error, result) => {
            if (!result) {
                var model = {
                    socketId: socket.id,
                    roomId: roomId,
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


const forwardConnectionRequest = (roomId, socket, payload) => {
    const { userId, otherUserId, name } = payload.data;
    var model = {
        roomId: roomId,
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
        socket.to(result.socketId).emit("message", sendPayload);
    })
}
const forwardIcCanidate = (roomId, socket, meetingServer, payload) => {
    const { userId, otherUserId, canidate } = payload.data;
    var model = {
        roomId: roomId,
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

const forwardOfferSdp = async (roomId, socket, payload, io) => {
    console.log("## forwardOfferSdp ##", payload)
    const { userId, otherUserId, offer } = payload;
    const model = {
        roomId: roomId,
        otherUserId: otherUserId,
    }
    const result = await LiveUsers.findOne({ userId: otherUserId });
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

const forwardAnswerSDP = (roomId, socket, meetingServer, payload) => {
    const { userId, otherUserId, sdp, answer } = payload;
    var model = {
        roomId: roomId,
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
        socket.broadcast.to(result.socketId).emit("message", sendPayload);
    })
}

const userLeft = (roomId, socket, meetingServer, payload) => {
    console.log("User left meeting helper")
    const { userId } = payload;
    meetingServices.leaveRoom(payload, (error, result) => {
        if (error) {
            broadcastUser(roomId, socket, {
                type: "error",
                data: {
                    userId: userId
                }
            })
        }
        else {
            if (result.success)
                broadcastUser(roomId, socket, {
                    type: MeetingPayloadEnum.USER_LEFTL,
                    data: {
                        userId: userId
                    }
                })
        }
    });
}

const meetingEnd = (roomId, socket, meetingServer, payload) => {
    const { userId } = payload.data;

    broadcastUser(roomId, socket, {
        type: MeetingPayloadEnum.MEETING_ENDED,
        data: {
            userId: userId
        }
    })

    meetingServices.getAllMeetingUsers(roomId, (error, result) => {
        for (let i = 0; i < result.length; i++) {
            const meetingUser = result[i];
            meetingServer.sockets.connected(meetingUser.socketId).disconnect();
        }
    })
}

const forwardEvent = (roomId, socket, meetingServer, payload) => {
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
const meetingHelper = { joinRandomCall, sendMessageP2P, joinMeeting, addUser, forwardConnectionRequest, forwardAnswerSDP, forwardIcCanidate, userLeft, forwardOfferSdp, forwardEvent, meetingEnd }

export { meetingHelper }