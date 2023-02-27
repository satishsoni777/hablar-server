
import { mongoose } from "mongoose"

const myDB = mongoose.connection.useDb('users');
const meeting = myDB.model(
    "Meeting",
    mongoose.Schema({
        socketId: {
            type: String,
            required: false,
        },
        meetingId: {
            type: String,
            required: false
        },
        UserId: {
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