import { mongoose } from "mongoose";

const authData = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    mobile: {
        type: Number,
        require: true
    },
    email_id: {
        type: String,
        require: true
    },
    gender: {
        type: String,
        require: true
    },
    state: {
        type: String,
        require: true
    },
    country: {
        type: String,
        require: true
    },
    socketId: {
        type: String,
        require: false,
    },
    pin: {
        type: Number,
        require: true,
        min: [10, 'Too few eggs'],
        max: 12
    },
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
const myDB = mongoose.connection.useDb('webrtc');
export const UsersData = myDB.model("AuthData", authData);


