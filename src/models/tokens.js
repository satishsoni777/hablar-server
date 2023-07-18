import mongoose from "mongoose"

const token = new mongoose.Schema({
    token: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
    userId: {
        type: String,
    },
    createdAt: {
        type: String,
    },
    expireAt: {
        type: String,
    },
    uid: {
        type: String,
    }

},
    {
        toJSON: {
            transform: function (doc, ret) {
                ret.id = ret._id.toString(),
                    delete ret._id;
                delete ret._v;
                delete ret.__v;
                delete ret.__id
            }
        }
    }
);
const db = mongoose.connection.useDb("users");
export const Tokens = db.model("tokens", token);