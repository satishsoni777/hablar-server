
import { mongoose } from "mongoose";


const userScheme = new mongoose.Schema({

    followersCount: {
        type: Number,
    },
    avatarImage: {
        type: String
    },
    followingCount: {
        type: Number,
    },
    created: {
        type: String,
        default: new Date().toISOString(),
    },
    authType: {
        type: String,
    },
    userId: {
        type: String,
        required: false,
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
    rating: {
        type: Number,
        default: 1,
    },
    durationLeft: {
        type: Number,
    },
    durationTalked: {
        type: Number
    }

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
userScheme.pre('save', function (next) {
    this.followersCount = this.followers.length;
    this.followingCount = this.following.length;
    next();
});

const db = mongoose.connection.useDb("webrtc");
export const Users = db.model("users", userScheme);



