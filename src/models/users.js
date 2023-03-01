import { mongoose } from "mongoose";
const userScheme = new mongoose.Schema({
    name: {
        type: String,
        required:false,
    },
    email_id: {
        type: String,
        lowercase:true,
        unique: true,
        required:false
    },
    gender: {
        type: String,
        required:false
    },
    state: {
        type: String,
        required:false
    },
    country: {
        type: String,
        required:false
    },
    pin: {
        type: Number,
        required:false,
    },
    mobile:{
        type: Number,
        required:false,
        unique: true,
    }
},);
const db=mongoose.connection.useDb("users");
export const Users = db.model("Users", userScheme);


