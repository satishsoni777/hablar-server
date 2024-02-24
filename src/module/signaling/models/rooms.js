import mongoose from "mongoose";
import { nanoid } from 'nanoid';
import { getCurrentIstTime } from "../../../utils/date_util.js";

export const JoinedUserModel = new mongoose.Schema({
    userId: {
        type: Number,
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
        default: getCurrentIstTime
    },
    sdp: {
        type: String
    },
    icCandiate: {
        type: String
    },
    socketId: {
        type: String
    }
});

const roomsSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        default: nanoid(7)
    },
    socketId: {
        type: String
    },
    userId: {
        type: Number,
    },
    pinCode: {
        type: Number,
    },
    joinSize: {
        type: Number,
        default: 0
    },
    joinedUsers: [JoinedUserModel],
}, {
    timestamps: true, // Corrected typo
    toJSON: {
        transform: function (doc, obj) {
            delete obj.__v;
            return obj._v;
        }
    }
});

// Remove duplicate toJSON setter
roomsSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v;
        return ret;
    },
    versionKey: false
});

const db = mongoose.connection.useDb("signaling");
export const Rooms = db.model("rooms", roomsSchema);
