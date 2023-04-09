import express from "express";
import bodyParser from "body-parser"
import callHistory from './src/routes/call_history_routes.js'
import utils from './src/utils/util.js'
import { MongoDb } from './src/db/mongoose_db.js';
import auth from './src/routes/authentication_routes.js'
import http from 'http';
import { connectSocketIo } from './server-io.js';
import meetingControllerRoutes from "./src/routes/meeting_controller_routes.js";
import feedback from './src/routes/feedback_routes.js';
import users from "./src/routes/users_routes.js";


const app = express();
const router = express.Router();

const PORT = process.env.PORT || 8082;

app.set('port', PORT);
app.use("/.netlify/functions/api", router)
app.use(bodyParser.json());
app.use(express.json())

app.use("/", callHistory);
app.use('/utils', utils);
app.use('/users', users);
app.use('/authentication', auth);
app.use("/meeting", meetingControllerRoutes);
app.use(("/feedback", feedback));




const commonServer = http.createServer(app, {
    requestCert: true,
});
commonServer.listen(PORT, () => {
    MongoDb.instance.connectMd();
    connectSocketIo(commonServer);
    console.log("Listening at port", PORT);
})


