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
                    id: decode.id,
                    emailId: decode.emailId,
                    createdAt: decode.iat,
                    exp: decode.exp,
                }
            })
        }
    });
}

// Middleware function to validate the token
const authenticateToken = (req, res, next) => {
    // Get the token from the request header
    const token = req.header('Authorization');

    // Check if the token exists
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, 'your-secret-key');

        // Add the decoded token payload to the request object
        req.user = decoded;

        // Call the next middleware function
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token.' });
    }
};

export const JwtToken = { getToken, validateToken, authenticateToken }