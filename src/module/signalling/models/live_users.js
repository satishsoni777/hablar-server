
import mongoose from "mongoose"

const liveUser = new mongoose.Schema({
    userId: {
        type: Number,
        required: false
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
                delete ret.__id;
                delete ret.__v;
                delete ret._v;
            }
        }
    }
);
const db = mongoose.connection.useDb("signalling");
const LiveUser = db.model("liveuser", liveUser);
export { LiveUser };

