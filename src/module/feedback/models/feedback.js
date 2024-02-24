import { mongoose } from "mongoose";
import { getCurrentIstTime } from "../../../utils/date_util.js";

const fdSch = new mongoose.Schema({
    userId: {
        type: Number
    },
    likes: {
        type: Number,
        default: -1
    },
    follow: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
    comment: {
        type: String,
    },
    name: {
        type: String
    },
    image: {
        type: String
    },
    createdAt: {
        type: String,
        default: getCurrentIstTime
    }
},
    {
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

const fs = new mongoose.Schema({
    userId: {
        type: Number
    },
    avgRating: {
        type: Number,
    },
    feedbacks: [fdSch]
});

const db = mongoose.connection.useDb("users");
export const Feedback = db.model("feedback", fs);