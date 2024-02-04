import { Users } from "../../users/models/users.js";
import { BaseController } from "../../../webserver/base_controller.js";

const baseController = new BaseController();

const sendMessage = async (req, res,) => {
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

    Users.find().skip(lowerLimit == 1 ? 0 : lowerLimit).limit(upperLimit).lean().exec(function (err, users) {
        if (err) {
            return baseController.errorResponse(err, res);
        }
        else {
            return baseController.successResponse({ users: users }, res);
        }

    });
}
export const ChatController = { sendMessage }