
import { mongoose } from "mongoose"

const myDB = mongoose.connection.useDb("webrtc");
const meeting = myDB.model(
    "meeting",
    mongoose.Schema({
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
        }
    )
);


// eslint-disable-next-line no-undef

export { meeting }