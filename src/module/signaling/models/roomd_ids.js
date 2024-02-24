import mongoose from "mongoose";


const roomIds = new mongoose.Schema({
    roomId: {
        type: String,
    },
    socketId: {
        type: String
    },
    userId: {
        type: Number
    },
}
);

const db = mongoose.connection.useDb("signaling");
export const RoomsIds = db.model("roomids", roomIds);


