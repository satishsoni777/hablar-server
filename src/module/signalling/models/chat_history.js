import { mongoose } from "mongoose";

const chatHistory = new mongoose.Schema({});



const db = mongoose.connection.useDb("signalling");
export const ChatHistory = db.model("ChatHistory", chatHistory);