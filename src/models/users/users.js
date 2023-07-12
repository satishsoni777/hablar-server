
import { mongoose } from "mongoose";


const userScheme = new mongoose.Schema({
    followersCount: {
        type: Number,
    },
    avatarImage: {
        type: String
    },
    likes: {
        type: Number,
        default: 0
    },
    dislike: {
        type: Number,
        default: 0
    },
    followingCount: {
        type: Number,
    },
    createdAt: {
        type: String,
        default: Date.now()
    },
    authType: {
        type: String,
    },
    userId: {
        type: Number,
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
    mobile: {
        type: String,
        required: false,
        default: null,
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
    },

}, {
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id.toString(),
                delete ret._id;
            delete ret._v;
            delete ret.id
        }
    }
}
);
userScheme.pre('save', function (next) {
    this.followersCount = this.followers?.length ?? 0;
    this.followingCount = this.following?.length ?? 0;
    next();
});

const db = mongoose.connection.useDb("users");
export const Users = db.model("users", userScheme);



