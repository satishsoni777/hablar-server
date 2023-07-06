import mongoose from "mongoose";

const JoinedUserDetails = new mongoose.Schema({
    otherUserId: {
        type: Number,
        required: true
    },
    image: {
        type: String
    },
    roomId: {
        type: String
    },
    startTime: { type: Date, required: true, default: Date.now(), },
    endTime: { type: Date, required: false, default: Date.now() },
    duration: { type: Number },
    name: {
        type: String,
    }
});

const callHistorySchema = new mongoose.Schema({
    userId: {
        type: Number
    },
    callEnd: {
        type: Boolean,
        default: false
    },
    history: [JoinedUserDetails],
    createdAt: {
        type: String,
        default: new Date().toISOString()
    },
}, {
    toJSON: {
        transform: function (doc, obj) {
            delete obj._id;
            return obj;
        }
    },
},);




const db = mongoose.connection.useDb("users")
export const CallHistory = db.model("callhistory", callHistorySchema)