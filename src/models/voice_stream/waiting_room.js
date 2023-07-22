
import mongoose from "mongoose"

const waitingroom = new mongoose.Schema({
    userId: {
        type: Number,
    },
    startTime: {
        type: String,
        default: new Date().toISOString(),
    },
    socketId: {
        type: String,
        required: false
    },
    online: {
        type: Boolean,
        required: false
    }
},
    {
        toJSON: {
            transform: function (doc, ret) {
                ret.id = ret._id.toString(),
                    delete ret._id;
                delete ret._v;
            }
        }
    }
);
const db = mongoose.connection.useDb("voice_stream");
export const WaitingRoom = db.model("waitingroom", waitingroom);
