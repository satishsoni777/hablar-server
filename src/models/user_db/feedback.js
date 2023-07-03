import { mongoose } from "mongoose";
const FeedbackSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    avatarImage: {
        type: String,
    },
    name: {
        type: String,
    },
    title: {
        type: String,
    },
    message: {
        type: String,
    },
    rating: {
        type: Number,
    }
});

const db = mongoose.connection.useDb("users");
export const Feedback = db.model("Feedback", FeedbackSchema);