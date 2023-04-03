
import mongoose from "mongoose"
const myDB = mongoose.connection.useDb('webrtc');
const MeetingUser = myDB.model(
    "MeetingUser",
    mongoose.Schema({
        hostId: {
            type: String,
            required: true,
        },
        emailId: {
            type: String,
            required: false
        },
        hostName: {
            type: String,
            required: true
        },
        startTime: {
            type: Date,
            require: true
        },
        roomId: {
            type: String,
            required: false,
        }

    },
        {
            toJSON: {
                transform: function (doc, ret) {
                    ret.id = ret._id.toString(),
                        delete ret._id;
                    delete ret._v;
                }
            }
        }
    )
);
export { MeetingUser };
