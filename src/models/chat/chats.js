import mongoose from "mongoose";

const Content = new mongoose.Schema({
    messageType: {
        type: String
    },
    text: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    media: {
        type: String,
    },
});

const chat = new mongoose.Schema({
    userId: {},
    messageId: {},
    senderId: {},
    receiverId: {},
    content: Content,
});

const db = mongoose.connection.useDb("chat_db")
export const UserChat = db.model("chats", chat);