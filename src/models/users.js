import { mongoose } from "mongoose";
const userScheme = new mongoose.Schema({
    created: {
        type: String,
        default: new Date().toISOString(),
    },
    authType: {
        type: String,
    },
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: false,
        default: null,
    },
    emailId: {
        type: String,
        required: false,
        unique: false,
        match: /.+\@.+\..+/,
    },
    gender: {
        type: String,
        required: false,
        default: null,
    },
    state: {
        type: String,
        required: false,
        default: null,
    },
    country: {
        type: String,
        required: false
    },
    pin: {
        type: Number,
        required: false,
        default: null,
    },
    mobileNumber: {
        type: String,
        required: false,
        default: null,
    },
    uid: {
        type: String,
    },
    token: {
        type: String,
        default: null,
    },
    password: {
        type: String,
    },

}, {
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id.toString(),
                delete ret.__id;
            delete ret.__v;
        }
    }
}
);

const db = mongoose.connection.useDb("webrtc");
export const Users = db.model("Users", userScheme);


