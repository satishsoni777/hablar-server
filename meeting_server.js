import { meetingHelper } from "./src/utils/meeting_helper.js"
import { MeetingPayloadEnum } from "./src/utils/meeting_payload_enums.js"


const parseMessage = (message) => {
    try {
        const payload = JSON.parse(message);
        return payload;
    }
    catch (error) {
        return { type: MeetingPayloadEnum.UNKNOWN };
    }
}

const listenMessage = (meetingId, socket, meetingServer) => {
    socket.on("message", (message) => handleMessage(meetingId, socket, meetingServer));
}
function handleMessage(meetingId, socket, message, meetingServer) {
    var payload = "";

    if (typeof message == "string") {
        payload = parseMessage(message);
    }
    {
        payload = message;
    }
    switch (payload.type) {
        case MeetingPayloadEnum.JOINED_MEETING:
            meetingHelper.joinMeeting(meetingId, socket, meetingServer, payload,);
            break;
        case MeetingPayloadEnum.CONNECTION_REQUEST:
            meetingHelper.forwardConnectionRequest(meetingId, socket, meetingServer, payload,);
            break;
        case MeetingPayloadEnum.OFFER_SDP:
            meetingHelper.forwardOfferSdp(meetingId, socket, meetingServer, payload);
            break;
        case MeetingPayloadEnum.ANSWER_SDP:
            meetingHelper.forwardAnswerSDP(meetingId, socket, meetingServer, payload,);
            break;
        case MeetingPayloadEnum.LEAVE_MEETING:
            meetingHelper.userLeft(meetingId, socket, meetingServer, payload,);
            break;
        case MeetingPayloadEnum.END_MEETING:
            meetingHelper.meetingEnd(meetingId, socket, meetingServer, payload,);
            break;
        case MeetingPayloadEnum.ICECANDIDATE:
            meetingHelper.forwardIcCanidate(meetingId, socket, meetingServer, payload)
            break;
        case MeetingPayloadEnum.VIDEO_TOOGLE:
        case MeetingPayloadEnum.AUDIO_TOOGLE:
            meetingHelper.forwardEvent(meetingId, socket, meetingServer, payload,);
            break;
        case MeetingPayloadEnum.UNKNOWN:
            break;
        default:
            break;
    }
}

const meetingServer = { listenMessage };
export { meetingServer }
