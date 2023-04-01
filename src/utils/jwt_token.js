import Jwt from 'jsonwebtoken';

import { Config } from '../config/default.js'

const getToken = async (params, res, next) => {
    const { id, emailId } = params;
    console.log(params);
    const token = Jwt.sign(
        { id: id, emailId: emailId },
        process.env.TOKE_KEY || Config.TOKEN_KEY,
        {
            expiresIn: "24h",
        }
    );
    return token;
}
const validateToken = async (req, res, next) => {
    const { token } = req.body;
     Jwt.verify(token, process.env.TOKE_KEY || Config.TOKEN_KEY, function (err, decode) {
        if (err) {
            if (err.name.toString() == "TokenExpiredError") {
                res.status(401).send({
                    success: false,
                    error: {
                        message: "Token expired",
                        type: err.name
                    }
                })
            }
            else {
                res.status(401).send(err)
            }

        }
        else {
            // var date=new Date(decode.exp * 1000);
            res.status(200).send({
                success: true,
                "data": {
                    id:decode.id,
                    emailId:decode.emailId,
                    createdAt:decode.iat,
                    exp:decode.exp,
                }
            })
        }
    });
}
export const JwtToken = { getToken, validateToken }