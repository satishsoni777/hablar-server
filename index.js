import express  from "express";
import bodyParser from "body-parser"
import userRoutes from './src/routes/auth.js';
import path from 'path';


const __dirname = path.resolve();
const app=express();

var PORT = process.env.PORT|| 8080;

app.set('port', PORT);

app.use(bodyParser.json());

app.use("/users",userRoutes) 
console.log(__dirname);
app.get('/download', function(req, res){
    const file = `${__dirname}/apk/app-cash-release.apk`;
    res.download(file); // Set disposition and send it.
  });

app.get("/",(req,res)=>{
    console.log("Test")
    res.send("Hi how are you")
});

app.listen(PORT,()=>{
    console.log("Server running on port",PORT)
})
