import express from "express";
import bodyParser from "body-parser"
import { MongoDb } from './src/db/mongoose_db.js';
import auth from './src/routes/authentication_routes.js'
import http from 'http';
import { connectSocketIo } from './server-io.js';
import callController from "./src/routes/meeting_controller_routes.js";
import feedback from './src/routes/feedback_routes.js';
import users from "./src/routes/users_routes.js";
import chat from "./src/routes/chat_routes.js";
import callsHitory from "./src/routes/call_history_routes.js";
import session from 'express-session';
import dotenv from 'dotenv';



// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

dotenv.config();

const app = express();


const PORT = process.env.PORT || 8083;


app.set('port', PORT);

app.use(bodyParser.json());
app.use(express.json())


// app.use(session({
//     store: store,
//     secret: process.env.SERCET_KEY,
//     resave: false,
//     saveUninitialized: false
// }));

app.use(session({
    secret: process.env.SERCET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: oneDay },
}));

app.use('/users', users);
app.use('/authentication', auth);
app.use("/callStream", callController);
app.use("/feedback", feedback);
app.use("/chat", chat);
app.use("/calls", callsHitory);



const commonServer = http.createServer(app, {
    requestCert: true,
});

commonServer.listen(PORT, async () => {
    await MongoDb.instance.connectMd(function (e, r) {
    });
    connectSocketIo(commonServer);
    console.log("Server.js Listening at port", PORT);
})


