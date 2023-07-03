
import mongoose from "mongoose"

const liveUsers = new mongoose.Schema({
    userId: {
        type: String,
        required: false
    },
    startTime: {
        type: String,
        default: new Date().toISOString(),
    },
    roomId: {
        type: String,
        required: false,
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
    // {
    //     toJSON: {
    //         transform: function (doc, ret) {
    //             ret.id = ret._id.toString(),
    //                 delete ret._id;
    //             delete ret._v;
    //         }
    //     }
    // }
);
const db = mongoose.connection.useDb("webrtc");
const LiveUsers = db.model("liveUsers", liveUsers);
export { LiveUsers };
