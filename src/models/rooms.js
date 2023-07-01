import mongoose from "mongoose";
import { nanoid } from 'nanoid';


export const JoinedUserModel = new mongoose.Schema({
    userId: {
        type: String,
        required: false,
        unique: true
    },
    countryCode: {
        type: String,
        required: false
    },
    stateCode: {
        type: String,
        required: false
    },
    roomId: {
        type: String,
    },
    joinedAt: {
        type: String,
        default: new Date().toISOString()
    },
    sdp: {
        type: String
    },
    icCandiate: {
        type: String
    }
});


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
    joinedUserCount: {
        type: Number,
        default: 0,
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
    stateCode: {
        type: String,
        required: false
    },
    countryCode: {
        type: String,
        required: false
    },
    joinedUsers: [JoinedUserModel],

}, {
    timestaps: true
}, {
    toJSON: {
        transform: function (doc, obj) {
            delete obj.__v;
            return obj;
        }
    },
},
)
roomsSchema.pre('save', function (next) {
    this.joinedUserCount = this.joinedUsers.length;
    next();
});

const db = mongoose.connection.useDb("webrtc");
export const Rooms = db.model("rooms", roomsSchema);


