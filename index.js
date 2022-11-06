import express  from "express";
import bodyParser from "body-parser"
import userRoutes from './src/routes/auth.js';
import path from 'path';

import http from 'http';

const __dirname = path.resolve();

const app=express();

var PORT = process.env.PORT|| 8080;

app.set('port', PORT);

app.use(bodyParser.json());

app.use("/users",userRoutes) 



app.get('/download', function(req, res){
    const file = `${__dirname}/apk/app-cash-release.apk`;
    res.download(file); // Set disposition and send it.
  });

app.get("/",(req,res)=>{
    console.log("Test")
    res.send("Hi how are you")
});


http.createServer()

http.createServer(app).listen(app.get('port'), function () {
    console.log('AgoraSignServer starts at ' + app.get('port'));
});
