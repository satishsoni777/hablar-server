/* eslint-disable no-undef */
import express from "express";
import bodyParser from "body-parser"
import callHistory from './src/routes/call_history_routes.js'
import utils from './src/utils/util.js'
import {MongoDb} from './src/db/mongoose_db.js';
import auth from './src/routes/authentication_routes.js'
import rtcBuilder from './src/rtc/rtc_builder.js';
import path from 'path';
import http from 'http';
import { connectSocketIo } from './server-io.js';
import meetingControllerRoutes from "./src/routes/meeting_controller_routes.js";
import users from "./src/routes/users_routes.js";
// import  meetingControllers  from "./src/controller/meeting_controller.js";
// import { readFileSync } from "fs";

// import firebase from 'firebase-functions';

const __dirname = path.resolve();

const app = express();


const PORT = process.env.PORT || 8082;

app.set('port', PORT);

app.use(bodyParser.json());
app.use(express.json())

app.use("/", callHistory);
app.use('/utils', utils);
app.use('/users', users);
app.use('/authentication', auth);
app.use("/rtcBuilder", rtcBuilder)

app.use("/meeting",meetingControllerRoutes);
// app.post("/meeting/start", meetingControllers.startMeetingController);
// app.get("/meeting/join", meetingControllers.checkMeetingExistsController);
// app.get("/meeting/get", meetingControllers.getAllMeetingUsersController);

app.get("/", (req, res) => {
    console.log("Test")
    res.send("Hi how are you")
});



const commonServer = http.createServer(app, {
    requestCert: true,
});

commonServer.listen(PORT, () => {
    MongoDb.instance.connectMd();
    connectSocketIo(commonServer);
    console.log("Listening at port", PORT);
})


