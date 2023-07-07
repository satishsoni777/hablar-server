import mongoose from "mongoose"

const tokens = new mongoose.Schema({
    token: {
        type: String,
    },
    userId: {
        type: String,
    },
    createdAt: {
        type: String,
        default: Date.now()
    },
    expireAt: {
        type: String,
    },
    uid: {
        type: String,
    }

});
const db = mongoose.connection.useDb("tokens");
export const Tokens = db.model("tokens", tokens);