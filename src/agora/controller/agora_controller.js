import { BaseController } from "../../webserver/base_controller.js";
import pkg from 'agora-access-token';
const { RtcTokenBuilder, RtcRole } = pkg;
const baseController = new BaseController();
var APP_ID = "79e511b7bd03496ea13674e4409ca220";
var appCertificate = "44a137c3f5314a0ebbaeed88bd76fcf1";
var appCertificate = "44a137c3f5314a0ebbaeed88bd76fcf1";
var role = RtcRole.PUBLISHER
const expirationTimeInSeconds = 3600
const getAgoraToken = async (req, res, next) => {

    var currentTimestamp = Math.floor(Date.now() / 1000)
    const channelName = req.query.channelName;
    var privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds
    var uid = req.query.uid || 0

    var token = RtcTokenBuilder.buildTokenWithUid(APP_ID, appCertificate, channelName, uid, role, privilegeExpiredTs);

    return baseController.successResponse({
        "message": "Success",
        "rtcToken": token
    }, res,);

}


export const AgoraController = { getAgoraToken }