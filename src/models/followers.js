import { mongoose } from "mongoose";

const FollowersSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    avatarImage: {
        type: String,
    },
    name: {
        type: String,
    },

})

const FollowingSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    avatarImage: {
        type: String,
    },
    name: {
        type: String,
    },
});

const db = mongoose.connection.useDb("webrtc");
export const Followers = db.model("Followers", FollowersSchema);
export const Following = db.model("Following", FollowingSchema);