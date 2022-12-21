/* eslint-disable no-undef */
import express  from "express";
import bodyParser from "body-parser"
import auth from './src/routes/auth.js';
import callHistory from './src/routes/call_history.js'
import utils from './src/utils/util.js'
import connectMd from './src/db/mongoose_db.js';
import users from './src/routes/user.js'
import rtcBuilder from './src/rtc/rtc_builder.js';
import path from 'path';
import http from 'http';

// import firebase from 'firebase-functions';
 
const __dirname = path.resolve();

const app=express();


const PORT = process.env.PORT|| 8080;

app.set('port', PORT);

app.use(bodyParser.json());
app.use(express.json())

app.use("/auth",auth) 
app.use("/",callHistory);
app.use('/',utils);
app.use('/users',users);
app.use("/rtcBuilder",rtcBuilder)


app.get("/",(req,res)=>{
    console.log("Test")
    res.send("Hi how are you")
});



http.createServer(app).listen(app.get('port'), function () {
    initApp();
    console.log('Listening at port ' + app.get('port'));
});

var initApp = function () {
    connectMd();
}