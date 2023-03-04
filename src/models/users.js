import { mongoose } from "mongoose";
import { v4 as uuidv4, } from 'uuid';
const userScheme = new mongoose.Schema({
    created: {
        type: String,
        default: new Date().toISOString(),
    },
    type: {
        type:String,
    },
    name: {
        type: String,
        required: false,
    },
    email_id: {
        type: String,
        lowercase: true,
        required: false,
        unique: false,
        match: /.+\@.+\..+/,
    },
    gender: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    pin: {
        type: Number,
        required: false,
    },
    mobile: {
        type: Number,
        required: false,
        unique: false,
        default:null
    },
    uid:{
        type:String,
    },
    token:{
        type:String
    },
    password:{
        type:String,
    }
},);
const db = mongoose.connection.useDb("webrtc");
export const Users = db.model("Users", userScheme);


