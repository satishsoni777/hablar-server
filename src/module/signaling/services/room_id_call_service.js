import { Rooms } from "../models/rooms";

const joinRoomWithRoomId = function (params, callback) {
    var { roomId, data } = params;
    const { userId, countryCode } = data;
    const filter = { roomId: roomId };
    data.roomId = roomId;

    try {
        Rooms.findOne(filter).then((r) => {
            if (r != null) {
                for (var i = 0; i < r.joinedUsers.length; i++) {
                    if (r.joinedUsers[i].userId == userId) {
                        return callback(null, r);
                    }
                }
                r.joinedUsers.push(data)
                r.size.push(1);
                r.save().then((r) => {
                    return callback(null, r);
                }).catch((e) => {
                    return callback(e, null)
                });
            }
            else return callback("No room found", null);
        });
    }
    catch (e) {
        return callback({
            message: "No room found with given room id",
            success: false,
        }, null);
    }
}
const roomIdCallService = { joinRoomWithRoomId };
export { roomIdCallService }