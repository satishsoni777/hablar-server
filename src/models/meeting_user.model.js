
import mongoose from "mongoose"
const myDB = mongoose.connection.useDb('users');
const MeetingUser = myDB.model(
    "MeetingUser",
    mongoose.Schema({
        hostId: {
            type: String,
            required: true,
        },
        hostName: {
            type: String,
            required: true
        },
        startTime: {
            type: Date,
            require: true
        },
        meetingUsers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "MeetingUser"
            }
        ],

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
export  {MeetingUser};
