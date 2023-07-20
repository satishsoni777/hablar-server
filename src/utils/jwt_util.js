import Jwt from 'jsonwebtoken';

import { Config } from '../../config/default.js'
import { BaseController, HTTPFailureStatus } from '../webserver/base_controller.js';

const baseController = new BaseController();


const createAuthToken = async (params) => {
    const { userId } = params;
    const token = Jwt.sign(
        { userId: userId },
        process.env.TOKE_KEY || Config.TOKEN_KEY,
        {
            expiresIn: "1000h",
        }
    );
    const decodedToken = Jwt.decode(token);
    let expireAt, createdAt;
    if (decodedToken && decodedToken.exp) {
        expireAt = new Date(decodedToken.exp * 1000);
        createdAt = new Date(decodedToken.iat * 1000);
    } else {
        return { error: true, message: "Invalid token" }
    }
    const result = { token: token, expireAt: expireAt, createdAt: createdAt }
    return result;
}

const validateToken = (req, res, next) => {
    const { token } = req.body;
    Jwt.verify(token, process.env.TOKE_KEY || Config.TOKEN_KEY, function (err, decode) {
        if (err) {
            if (err.name.toString() == "TokenExpiredError") {
                return baseController.errorResponse({
                    success: false,
                    error: {
                        message: "Token expired",
                        type: err.name
                    }
                }, res, HTTPFailureStatus.UNAUTHORIZED);

            }
            else {
                return baseController.errorResponse(err, res, HTTPFailureStatus.UNAUTHORIZED);
            }

        }
        else {
            return baseController.successResponse({
                userId: decode.userId,
                createdAt: decode.iat,
                exp: decode.exp,
            }, res);
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
        const decoded = Jwt.verify(token, 'your-secret-key');

        // Add the decoded token payload to the request object
        req.user = decoded;

        // Call the next middleware function
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token.' });
    }
};

export const JwtUtil = { createAuthToken, validateToken, authenticateToken }