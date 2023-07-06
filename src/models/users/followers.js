import { mongoose } from "mongoose";

const FollowersSchema = new mongoose.Schema({
    userId: {
        type: Number
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
        type: Number
    },
    avatarImage: {
        type: String,
    },
    name: {
        type: String,
    },
});

const db = mongoose.connection.useDb("users");
export const Followers = db.model("Followers", FollowersSchema);
export const Following = db.model("Following", FollowingSchema);