
import { mongoose } from "mongoose";

const device = new mongoose.Schema({
    userId: {
        type: Number,
    },
    deviceToken: {
        type: String,
    },
    os: {
        type: String,
    },
    lastLoggedInAt: {
        type: String,
    }
});

const db = mongoose.connection("users");
export const DeviceInfo = db.model("device", device);
