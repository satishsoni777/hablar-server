import { Tokens } from "../../models/tokens.js";
import { Users } from "../../models/users/users.js";

const updateUserData = async (params, callback) => {
    const { userId, gender } = params;
    console.log("User user service", params)
    const filter = { userId: userId };
    const update = { gender: gender };
    try {
        const user = await Users.findOneAndUpdate(filter, update);
        if (user) {
            user.gender = gender;
            return callback(null, user);
        }
        else {
            return callback({ message: "No user found", error: true }, null);
        }
    }
    catch (e) {
        return callback(e, null);
    }
}

const getToken = async (params, callback) => {
    const { userId } = params;
    try {
        const token = await Tokens.findOne({ userId: userId });
        if (token) {
            return callback(null, token)
        }
    }
    catch (e) {
        return callback(e, null)
    }
}

export const UserService = { updateUserData, getToken }