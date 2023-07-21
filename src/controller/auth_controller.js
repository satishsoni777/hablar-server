import { Users } from '../models/users/users.js';
import { Tokens } from '../models/tokens.js';
import { AuthType } from '../../config/common/constant.js';
import { v4 as uuidv4, } from 'uuid';
import { JwtUtil } from "../utils/jwt_util.js";
import { EmailSendUtil } from '../utils/mail_sender.js'
import { BaseController, HTTPFailureStatus } from '../webserver/base_controller.js';

const baseController = new BaseController();

const SignUp = async (req, res,) => {
    var { authType } = req.body;
    // if (authType == AuthType.MOBILE_OTP_FB) {

    // }
    authType = authType.toUpperCase();
    var isEmailExist = false;
    var users = new Users(req.body);
    try {
        if (authType == AuthType.GMAIL) {
            isEmailExist = await findUserByEmail(req.body.emailId);
            if (isEmailExist) {
                res.statusCode = 409;
                return res.send({
                    success: false,
                    error: {
                        message: "Email id is already registered."
                    }
                })
            }
        }

        else if (authType == AuthType.MOBILE_OTP) {
            const { mobile } = req.body;
            const isMobileExist = await findUserByMobileNumber(mobile);
            if (isMobileExist) {
                res.statusCode = 409;
                return res.send({
                    success: false,
                    error: {
                        message: "Mobile number is already registered."
                    }
                })
            }
        }
        if (authType == AuthType.GMAIL) {
            users.userId = await generateUniqueUserID();
        }
        else if (authType == AuthType.MOBILE_OTP) {
            // const { mobile } = req.body;
            users.userId = await generateUniqueUserID();
        }
        users.save().then((d) => {
            res.statusCode = 200;
            delete d.token;
            return res.send({
                "success": true,
                "data": req.body
            })
        }).catch((e) => {
            if (e.code == 11000) {
                var errorMessage = "";
                if (e.keyPattern.mobile == 1) {
                    errorMessage = "Mobile number already registered";
                }
                else if (e.keyPattern.emailId == 1) {
                    errorMessage = "Email id already registered";
                }
                return baseController.errorResponse({
                    "user": req.body,
                    "message": errorMessage,
                }, res, HTTPFailureStatus.FORBIDDEN
                );
            }
            else {
                return baseController.errorResponse(e, res, HTTPFailureStatus.BAD_REQUEST
                );
            }
        });
    }
    catch (e) {
        return baseController.errorResponse(e, res, HTTPFailureStatus.BAD_REQUEST
        );
    }
}

const findUserByEmail = async (email) => {
    const user = await Users.findOne({
        emailId: email,
    });
    if (user) {
        return true;
    }
    return false;
};

const findUserByMobileNumber = async (mobile) => {
    const user = await Users.findOne({
        mobile: mobile,
    });
    if (user) {
        return true;
    }
    return false;
};

const SignIn = async (req, res) => {
    try {
        const { emailId, authType } = req.body;
        switch (authType) {
            case AuthType.MOBILE_OTP_FB:
                break;
            case AuthType.GMAIL:
                var isNewUser = false;
                const filter = { emailId: emailId };
                const update = { created: new Date().toISOString(), uid: uuidv4() };
                let user = await Users.findOneAndUpdate(filter, update);
                if (!user) {
                    isNewUser = true;
                    user = new Users(req.body);
                    user.emailId = emailId;
                    user.userId = await generateUniqueUserID();
                }

                const jwtResult = await JwtUtil.createAuthToken({
                    userId: user.userId
                });
                user.token = jwtResult.token;
                req.session.userId = user.userId;
                const updateData = { userId: user.userId, token: jwtResult.token, expireAt: jwtResult.expireAt, createdAt: jwtResult.createdAt }
                const result1 = await Tokens.findOneAndUpdate({ userId: user.userId }, updateData);
                let token;
                if (!result1) {
                    try {
                        token = new Tokens(updateData);
                        const [r1, r2] = await Promise.all([token.save(), user.save()]);
                    }
                    catch (e) {
                        return baseController.errorResponse(e, res);
                    }
                }
                else {
                    await user.save();
                }
                return baseController.successResponse({
                    success: true,
                    token: jwtResult.token,
                    createdAt: jwtResult.createdAt,
                    userId: user.userId,
                    expireAt: jwtResult.expireAt
                }, res);
        }
    }
    catch (e) {
        return baseController.errorResponse(e, res);
    }
}

function generateUserID() {
    return Math.floor(1000000 + Math.random() * 9000000);
}

async function isUniqueUserID(userID) {
    const id = await Users.findOne({ userId: userID });
    return id == null ? true : false;
}

// Generate a unique user ID
// Preserve 99 users
const generateUniqueUserID = async () => {
    const last = await Users.find().sort({ _id: -1 }).limit(1);
    if (last.length == 0 || last == null)
        return 100;
    else return parseInt(last[0].userId) + 1;
    // let userID = generateUserID();
    // while (!isUniqueUserID(userID)) {
    //     userID = generateUserID();
    // }
    // return userID;
}

const createPassword = (req, res, next) => {
    const { emailId, type, password } = req.body;
}

const validatedToken = (req, res, next) => {
    return JwtUtil.validateToken(req, res, next)
}

const sendMail = async (req, res, next) => {
    return EmailSendUtil.sendEmail(req, (err, result) => {
        if (err) {
            return baseController.errorResponse(err, res);
        }
        else return baseController.successResponse(result);
    })

}


const AuthController = { SignUp, SignIn, createPassword, validatedToken, sendMail }

export { AuthController }

