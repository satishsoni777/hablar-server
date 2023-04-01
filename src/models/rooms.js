import mongoose from "mongoose";
import { nanoid } from 'nanoid';
const roomsSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        default: nanoid(7)
    },
    hostId: {
        type: String,
    },
    emailId: {
        type: String,
        match: /.+\@.+\..+/,
    },
    pinCode: {
        type: Number,
    },
    state: {
        type: String,
    },
    createdAt: {
        type: String,
        default: new Date().toISOString()
    },
    stateCode:{
        type:String,
        required:false
    },
    countryCode:{
        type:String,
        required:true
    },
    joinedUsers: [{
        type: new mongoose.Schema,
        ref: "rooms",
    }]

}, {
    timestaps: true
}, {
    toJSON: {
        transform: function (doc, obj) {
            delete obj.__v;
            return obj;
        }
    },
},)
const db = mongoose.connection.useDb("webrtc");
export const Rooms = db.model("rooms", roomsSchema);

