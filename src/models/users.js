import { mongoose } from "mongoose";
const userScheme = new mongoose.Schema({
    created: {
        type: String,
        default: new Date().toISOString(),
    },
    authType: {
        type: String,
    },
    name: {
        type: String,
        required: false,
    },
    email_id: {
        type: String,
        lowercase: true,
        required: false,
        unique: false,
        match: /.+\@.+\..+/,
    },
    gender: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    pin: {
        type: Number,
        required: false,
    },
    mobile: {
        type: Number,
        required: false,
        unique: false,
        default: null
    },
    uid: {
        type: String,
    },
    token: {
        type: String
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


