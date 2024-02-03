import express from "express";
import bodyParser from "body-parser"
import { MongoDb } from './src/db/mongoose_db.js';
import auth from './src/routes/authentication_routes.js'
import http from 'http';
import { SocketIO } from './server-io.js';
import callController from "./src/routes/signaling_routes.js";
import feedback from './src/routes/feedback_routes.js';
import users from "./src/routes/users_routes.js";
import chat from "./src/routes/chat_routes.js";
import callsHitory from "./src/routes/call_history_routes.js";
import session from 'express-session';
import dotenv from 'dotenv';
import { AuthTokenMiddleware } from './middleware/auth_middleware.js';
import { Config } from "./config/default.js";
import { UserSession } from './middleware/user_session.js';
import { BaseController, HTTPFailureStatus } from "./src/webserver/base_controller.js";
import initData from "./src/routes/init_data_routes.js";
import agoraBuilder from "./src/routes/agora_routes.js"


const baseController = new BaseController();
// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8083;

app.set('port', PORT);
app.use(bodyParser.json());
// app.set('Cache-Control', 's-maxage=86400');
app.use(express.json())



app.use(session({
    secret: process.env.SERCET_KEY || Config.TOKEN_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: oneDay, secure: true },
}));


app.use((req, res, next) => {
    console.log("### Api  ###", req.url);
    console.log("### Requested Body  ###", req.body);
    console.log("### Requested params  ###", req.params);
    if (UserSession.whiteListing().includes(req.path)) {
        next();
    }
    else {
        const result = AuthTokenMiddleware.authMiddleware(req.headers['authorization']);
        if (result == null) {
            return baseController.errorResponse('Authorization token not provided',
                res,
                HTTPFailureStatus.UNAUTHORIZED
            );
        }
        else if (result && result.isValide) {
            req.session.userId = result.userId;
            next();
        }
        else {
            return baseController.errorResponse('Invalid token',
                res,
                HTTPFailureStatus.UNAUTHORIZED
            );
        }
    }

})

//Routes
app.use('/users', users);
app.use('/authentication', auth);
app.use("/signaling", callController);
app.use("/feedback", feedback);
app.use("/chat", chat);
app.use("/calls", callsHitory);
app.use("/init", initData);
app.use("/agora", agoraBuilder)

const server = http.createServer(app, {
    requestCert: true,
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use.`);
    } else {
        console.error('An error occurred while starting the server:', error.message);
    }
});

server.listen(PORT, () => {
    SocketIO.connectSocketIo(server);
    MongoDb.instance.connectMd();
    console.log(`Server listening on port ${PORT}`);
});
