import Jwt from "jsonwebtoken";
import { BaseController, HTTPFailureStatus } from '../src/webserver/base_controller.js';
import { Config } from '../config/default.js'

const baseController = new BaseController();

function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader)
        return baseController.errorResponse({ message: 'Authorization token not provided' }, res, HTTPFailureStatus.FORBIDDEN);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return baseController.errorResponse('Authorization token not provided', res, HTTPFailureStatus.UNAUTHORIZED);
    }

    const token = authHeader.substring(7); // Remove "Bearer " from the token
    const secretKey = process.env.TOKE_KEY || Config.TOKEN_KEY; // Replace with your own secret key
    console.log("secretKey ", secretKey);
    Jwt.verify(token, secretKey, (err, decodedToken) => {
        if (err) {
            return baseController.errorResponse({ message: 'Invalid token' }, res, HTTPFailureStatus.UNAUTHORIZED);
        }
        // Token is valid, store the user information in the request for future use
        req.session.userId = decodedToken.userId;
        next();
    });
}

const authTokenMiddleware = { authMiddleware };
export { authTokenMiddleware };