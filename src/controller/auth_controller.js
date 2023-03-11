import { Users } from '../models/users.js';
import { AuthType } from '../common/constant.js';
import { v4 as uuidv4, } from 'uuid';
import { JwtToken } from "../utils/jwt_token.js";
const SignUp = async (req, res,) => {
    var isEmailExist = false;
    try {
        if (req.body.type.toLowerCase() == AuthType.GMAIL) {
            isEmailExist = await findUserByEmail(req.body.email_id);
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
        else if (req.body.type.toLowerCase() == AuthType.MOBILE_OTP) {

        }
        var users = new Users(req.body);
        users.save().then((d) => {
            res.statusCode = 200;
            return res.send({
                "success": true,
                "user": d
            })
        }).catch((e) => {
            if (e.code == 11000) {
                var errorMessage = "";
                if (e.keyPattern.mobile == 1) {
                    errorMessage = "Mobile number already registered";
                }
                else if (e.keyPattern.email_id == 1) {
                    errorMessage = "Email id already registered";
                }
                res.statusCode = 409;
                return res.send({
                    "success": "Failed",
                    "user": req.body,
                    "error": {
                        "message": errorMessage
                    }
                })
            }
            else {
                res.statusCode = 400;
                return res.send({
                    "succes": "Failed",
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
        email_id: email,
    });
    if (user) {
        return true;
    }
    return false;
};
const SignIn = async (req, res, isNewUser) => {
    const filter = { email_id: req.body.email_id };
    const update = { created: new Date().toISOString(), uid: uuidv4() };
    const user = await Users.findOneAndUpdate(filter, update);
    console.log(user);
    const token = await JwtToken.getToken({
        email_id: user.email_id,
        id: user.id
    }, res);
    user.token = token;
    user.save();
    if (isNewUser || false) {
        const data = {
            email_id: user.email_id,
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
    const { email_id, type, password } = req.body;
}

const validatedToken = (req, res, next) => {
    return JwtToken.validateToken(req, res, next)
}


const AuthController = { SignUp, SignIn, createPassword, validatedToken }

export { AuthController }