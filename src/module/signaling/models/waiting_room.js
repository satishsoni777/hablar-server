
import mongoose from "mongoose"
import { getCurrentIstTime } from "../../../utils/date_util.js";

const waitingroom = new mongoose.Schema({
    userId: {
        type: Number,
    },
    timeStamp: {
        type: String,
        default: getCurrentIstTime
    },
    socketId: {
        type: String,
        required: false
    },
    online: {
        type: Boolean,
        required: false
    },
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
const db = mongoose.connection.useDb("signaling");
export const WaitingRoom = db.model("waitingroom", waitingroom);
