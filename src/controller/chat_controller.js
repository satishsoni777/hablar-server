import { Users } from "../models/users.js";


const sendMessage = async (req, res,) => {
    console.log("get All users");
    const pageNo = req.body.page_no;
    const pageSize = req.body.page_size;
    var lowerLimit, upperLimit;
    if (pageNo == 1) {
        lowerLimit = 1;
    }
    else {
        lowerLimit = (pageNo - 1) * pageSize;
    }
    upperLimit = pageNo == 1 ? pageSize : (pageNo - 1) * pageSize + pageSize;
    console.log(lowerLimit, upperLimit)
    Users.find().skip(lowerLimit == 1 ? 0 : lowerLimit).limit(upperLimit).lean().exec(function (err, users) {
        if (err) {
            res.statusCode = 401;
            return res.send({
                "failed": "not found"
            })
        }
        else
            return res.send({
                success: true,
                users: users
            });
    });
}
export const ChatController = { sendMessage }