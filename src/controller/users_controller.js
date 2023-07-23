import { UserSession } from "../../middleware/user_session.js";
import { Users } from "../models/users/users.js";
import { UserService } from '../service/users/users_service.js';
import { BaseController } from "../webserver/base_controller.js";

const baseController = new BaseController();

const getAllUsers = async (req, res,) => {
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

const getUserDetails = async (req, res, next) => {

}

const updateUserData = (req, res) => {
    const gender = req.body.gender;
    const params = { gender: gender, userId: UserSession.getUserId(req) }
    UserService.updateUserData(params, (e, result) => {
        if (e) {
            return baseController.errorResponse({ message: "Unable to update data" }, res,);
        }
        else {
            return baseController.successResponse(result, res,);
        }
    });
}

const getToken = async (req, res, next) => {
    const params = { userId: req.query.userId }
    UserService.getToken(params, (error, result) => {
        if (error) {
            return baseController.errorResponse(error, res)
        }
        return baseController.successResponse(result, res);
    });
}

const testServer = (req, res, next) => {
    return res.send({ success: true })
}

export const UserController = { getAllUsers, getUserDetails, testServer, updateUserData, getToken }