/* eslint-disable no-undef */
import express from "express";
import bodyParser from "body-parser"
import auth from './src/routes/auth.js';
import callHistory from './src/routes/call_history.js'
import utils from './src/utils/util.js'
// import connectMd from './src/db/mongoose_db.js';
import users from './src/routes/user.js'
import rtcBuilder from './src/rtc/rtc_builder.js';
import path from 'path';
import http from 'http';
import { connectSocketIo } from './server-io.js';
import { connectToWebsocket } from './server-ws.js';
// import { readFileSync } from "fs";

// import firebase from 'firebase-functions';

const __dirname = path.resolve();

const app = express();


const PORT = process.env.PORT || 8082;

app.set('port', PORT);

app.use(bodyParser.json());
app.use(express.json())

app.use("/auth", auth)
app.use("/", callHistory);
app.use('/', utils);
app.use('/users', users);
app.use("/rtcBuilder", rtcBuilder)


app.get("/", (req, res) => {
    console.log("Test")
    res.send("Hi how are you")
});



const commonServer = http.createServer(app, {
    requestCert: true,
});

commonServer.listen(PORT, () => {
    // connectMd();
    connectSocketIo(commonServer);
    // connectToWebsocket(commonServer);

    console.log("Listening at port", PORT);
})


