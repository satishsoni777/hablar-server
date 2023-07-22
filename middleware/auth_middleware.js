import Jwt from "jsonwebtoken";
import { BaseController, HTTPFailureStatus } from '../src/webserver/base_controller.js';
import { Config } from '../config/default.js'

const baseController = new BaseController();

function authMiddleware(params) {
    const authHeader = params;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    const token = authHeader.substring(7); // Remove "Bearer " from the token
    const secretKey = process.env.TOKE_KEY || Config.TOKEN_KEY; // Replace with your own secret key
    var isValide = false;
    var userId;
    Jwt.verify(token, secretKey, (err, decodedToken) => {
        console.log("authMiddleware", decodedToken)
        if (err) {
            isValide = false;
        }
        userId = decodedToken.userId;
        isValide = true;
    });
    return { isValide: isValide, userId: userId };
}

export const AuthTokenMiddleware = { authMiddleware };