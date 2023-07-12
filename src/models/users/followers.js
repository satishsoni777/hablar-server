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
},
    {
        toJSON: {
            transform: function (doc, ret) {
                ret.id = ret._id.toString(),
                    delete ret._id;
                delete ret._v;
                delete ret.id
            }
        }
    }
);

const db = mongoose.connection.useDb("users");
export const Followers = db.model("Followers", FollowersSchema);
export const Following = db.model("Following", FollowingSchema);