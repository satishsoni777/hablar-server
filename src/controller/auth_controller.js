import { Users } from '../models/users.js';
import { AuthType } from '../common/constant.js';
import { v4 as uuidv4, } from 'uuid';
import { JwtToken } from "../utils/jwt_token.js";
import { EmailSendUtil } from '../utils/mail_sender.js'


const SignUp = async (req, res,) => {
    console.log(req.body);
    var { emailId, mobileNumber, authType } = req.body;
    authType = authType.toUpperCase();
    var isEmailExist = false;
    console.log(authType);
    var users = new Users(req.body);
    try {
        if (authType == AuthType.GMAIL) {
            isEmailExist = await findUserByEmail(req.body.emailId);
            console.log(isEmailExist);
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
            const { mobileNumber } = req.body;
            const isMobileExist = await findUserByMobileNumber(mobileNumber);
            console.log(isMobileExist);
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

            users.userId = emailId.substring(0, emailId.indexOf("@"));
        }
        if (authType == AuthType.MOBILE_OTP) {
            const { mobileNumber } = req.body;
            users.userId = mobileNumber;
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
                res.statusCode = 409;
                return res.send({
                    "success": false,
                    "user": req.body,
                    "error": {
                        "message": errorMessage
                    }
                })
            }
            else {
                res.statusCode = 400;
                return res.send({
                    "success": false,
                    "message": e
                })
            }
        });
    }
    catch (e) {
        res.statusCode = 400;
        return res.send({ failed: "bad request", error: e })
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
const findUserByMobileNumber = async (mobileNumber) => {
    const user = await Users.findOne({
        mobileNumber: mobileNumber,
    });
    if (user) {
        return true;
    }
    return false;
};
const SignIn = async (req, res, isNewUser) => {
    const { emailId, mobileNumber, authType } = req.body;
    const filter = { emailId: emailId };
    const update = { created: new Date().toISOString(), uid: uuidv4() };
    const user = await Users.findOneAndUpdate(filter, update);

    const token = await JwtToken.getToken({
        emailId: user.emailId,
        id: user.id
    }, res);
    user.token = token;
    user.save();
    if (isNewUser) {
        const data = {
            emailId: user.emailId,
            state: user.state,
            pin: user.pin,
            name: user.nam,
            type: user.type,
            uid: user.uid,
        };
        return res.status(200).send({
            success: true,
            token: user.token,
            createdAt: new Date().toISOString(),
        })
    }
    return res.status(200).send({
        success: true,
        token: user.token,
    })
}

const createPassword = (req, res, next) => {
    const { emailId, type, password } = req.body;
}

const validatedToken = (req, res, next) => {
    return JwtToken.validateToken(req, res, next)
}

const sendMail = async (req, res, next) => {
    return EmailSendUtil.sendEmail(req, (err, result) => {
        if (err) {
            return res.status(401).send(err);
        }
        else res.state(200).send(result)
    })

}


const AuthController = { SignUp, SignIn, createPassword, validatedToken, sendMail }

export { AuthController }