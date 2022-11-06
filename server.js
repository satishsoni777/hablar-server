import express  from "express";
import bodyParser from "body-parser"
import auth from './src/routes/auth.js';
import callHistory from './src/routes/call_history.js'
import utils from './src/utils/util.js'
import path from 'path';
import http from 'http';
import { readFile } from "fs/promises";

const __dirname = path.resolve();

const app=express();

const PORT = process.env.PORT|| 8080;

app.set('port', PORT);

  
app.use(bodyParser.json());

app.use("/users",auth) 
app.use("/",callHistory);
app.use('/',utils);



app.get("/",(req,res)=>{
    console.log("Test")
    res.send("Hi how are you")
});



http.createServer(app).listen(app.get('port'), function () {
    console.log('AgoraSignServer starts at ' + app.get('port'));
});
