import express  from "express";
import bodyParser from "body-parser"
import userRoutes from './src/routes/auth.js';

const app=express();

const PORT= 8080;

app.use(bodyParser.json());

app.use("/users",userRoutes) 


app.get("/",(req,res)=>{
    console.log("Test")
    res.send("Hi how are you")
});

app.listen(PORT,()=>{
    console.log("Server running on port",PORT)
})