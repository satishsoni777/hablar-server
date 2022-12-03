import { mongoose } from "mongoose";
const userScheme = new mongoose.Schema({
    name: {
        type: String,
        require:true,
    },
    email_id: {
        type: String,
        require:true,
        lowercase:true,
    },
    gender: {
        type: String,
        require:true
    },
    state: {
        type: String,
        require:true
    },
    country: {
        type: String,
        require:true
    },
    pin: {
        type: Number,
        require:true,
        min: [10, 'Too few eggs'],
        max: 12
    },
},);
export const Users = mongoose.model("Users", userScheme);


