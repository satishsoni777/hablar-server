import mongoose from "mongoose";

const JoinPersonDetails = new mongoose.Schema({
    userId: {
        type: String,
    },
    icon: {
        type: String
    },
    duration: {
        type: Number,
    },
    date: {
        type:Date
    },
    rating: {
        type: Number,
        default: 1
    },
    name: {
        type: String,
    }

});

const callHistory = new mongoose.Schema({
    userId: {
        type: String
    },
    history: [JoinPersonDetails],
}, {

    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id.toString(),
                delete ret.__id;
            delete ret.__v;
        }
    }
});

const md = mongoose.connection.useDb("webrtc")
export const CallHistory = md.model("callhistory", callHistory)