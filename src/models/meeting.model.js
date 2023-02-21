
import  { mongoose } from "mongoose"


const meeting = mongoose.model(
    "Meeting",
    mongoose.Schema({
        socketId: {
            type: String,
            required: true,
        },
        meetingId: {
            type: String,
            required: true
        },
        UserId: {
            type: String,
            require: true
        },
        joined: {
            type: Boolean,
            require: true
        },
        name: {
            type: Boolean,
            require: true
        },
        isAlive: {
            type: Boolean,
            required: true
        }


    },

        {
            timestaps: true
        }
    )
);

// eslint-disable-next-line no-undef

export {meeting}