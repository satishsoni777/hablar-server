import { Schema,mongoose } from "mongoose";
const Schema = mongoose.Schema;
const UserData = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    pin: {
        type: Number,
        required: true,
    },
})
module.exports = mongoose.model("UserData", UserData);