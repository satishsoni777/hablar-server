import express from "express";
import pkg from 'agora-access-token';
const { RtcTokenBuilder, RtcRole } = pkg;
const router = express.Router();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var APP_ID = "79e511b7bd03496ea13674e4409ca220";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var appCertificate = "44a137c3f5314a0ebbaeed88bd76fcf1";
var expirationTimeInSeconds = 3600
var role = RtcRole.PUBLISHER
router.post("/rtcToken", function (req, res) {
    console.log("Getting request", req.headers);
    var currentTimestamp = Math.floor(Date.now() / 1000)
    const channelName = req.body.channelName;
    var privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds
    var uid = req.query.uid || 0
    var token = RtcTokenBuilder.buildTokenWithUid(APP_ID, appCertificate, channelName, uid, role, privilegeExpiredTs);
    console.log("RTC agora Token ",token)
    res.status(200).send({
        "message": "Success",
        "rtcToken": token
    })
});
router.get('/call_history',function(req,res){
    
    res.status(200).send();
});


// eslint-disable-next-line no-undef

export default router;