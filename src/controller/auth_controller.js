import { Users } from '../models/users.js';
import { AuthType } from '../common/constant.js';
import { v4 as uuidv4, } from 'uuid';
import Jwt from 'jsonwebtoken';
import { Config } from '../config/default.js'
// eslint-disable-next-line no-undef
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
                        message: "Email id already registered"
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
    const token = Jwt.sign(
        { user_id: user._id, email: user.email_id },
        process.env.TOKE_KEY || Config.TOKEN_KEY
    );
    user.token = token;
    user.save();
    if (isNewUser || false) {
        const data = {
            email_id: user.email_id,
            state: user.state,
            pin: user.pin,
            name: user.nam,
            type: user.type,
            uid: user.uid
        };
        return res.send({
            success: true,
            token: user.token,
            user: data
        })
    }
    return res.send({
        success: true,
        token: user.token,
    })
}
const createPassword = (req, rs, next) => {
    const token = req.headers.token;
    const { email_id, type, password } = req.body;
}

const validatedToken = async (req, res, next) => {
    const isTokenValid = await Jwt.verify(req.headers.authentication_token, process.env.TOKE_KEY || Config.TOKEN_KEY, function (err, decode) {
        console.log(err);
    });
    return false;
}


const AuthController = { SignUp, SignIn, createPassword, validatedToken }

export { AuthController }