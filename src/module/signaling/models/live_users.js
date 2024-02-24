
import mongoose from "mongoose"
import { getCurrentIstTime } from '../../../utils/date_util.js'
const liveUser = new mongoose.Schema({
    userId: {
        type: Number,
        required: false
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
    lastActive: {
        type: String,
        required: false
    }
},
    {
        toJSON: {
            transform: function (doc, ret) {
                ret.id = ret._id.toString(),
                    delete ret._id;
                delete ret.__id;
                delete ret.__v;
                delete ret._v;
            }
        }
    }
);
const db = mongoose.connection.useDb("signaling");
const LiveUser = db.model("liveuser", liveUser);
export { LiveUser };

