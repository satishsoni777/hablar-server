import { mongoose } from "mongoose";

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
    message: {
        type: String,
    },
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