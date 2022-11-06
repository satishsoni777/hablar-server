// import express  from "express";
// import bodyParser from "body-parser"
// import userRoutes from './src/routes/auth.js';
// import path from 'path';
// import http from 'http';
// // import callHistory from './src/routes/call_history';
// import { readFile } from "fs/promises";

// const __dirname = path.resolve();

// const app=express();

// var PORT = process.env.PORT|| 8080;

// app.set('port', PORT);

  
// app.use(bodyParser.json());

// app.use("/users",userRoutes) 

// app.get('/download/link',function(req,res){
//     response.pipe(file);
//    // after download completed close filestream
//    file.on("finish", () => {
//        file.close();
//        console.log("Download Completed");
//    });
// })

// app.get('/download', function(req, res){
//     const file = `${__dirname}/apk/app-cash-release.apk`;
//     res.download(file); // Set disposition and send it.
//   });

// app.get('/download/poker.apk',function(req,res){
//     const file = `${__dirname}/apk/app-poker-release.apk`;
//     res.download(file);
// })



// app.get("/",(req,res)=>{
//     console.log("Test")
//     res.send("Hi how are you")
// });



// http.createServer(app).listen(app.get('port'), function (req,res) {
//     console.log('AgoraSignServer starts at ' + app.get('port'));
// });
