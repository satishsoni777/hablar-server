
import { mongoose } from "mongoose"

const meetingSchema = new mongoose.Schema({
    socketId: {
        type: String,
        required: false,
    },
    meetingId: {
        type: String,
        required: false
    },
    userId: {
        type: String,
        require: false
    },
    joined: {
        type: Boolean,
        require: false
    },
    name: {
        type: Boolean,
        require: false
    },
    isAlive: {
        type: Boolean,
        required: false
    },
    hostName: {
        type: String,
        required: false,
    },
    hostId: {
        type: String,
        require: false,
    }
},
    {
        timestaps: true
    },
    {
        toJSON: {
            transform: function (doc, ret) {
                ret.id = ret._id.toString(),
                    delete ret._id;
                delete ret.__v;
            }
        }
    }
);

const db = mongoose.connection.useDb("webrtc");
export const Meeting = db.model("Meeting", meetingSchema);
