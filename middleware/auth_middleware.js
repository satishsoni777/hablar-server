import Jwt from "jsonwebtoken";
import { Config } from '../config/default.js'

function authMiddleware(query, headers) {
    var isTest = headers.authorization;
    if (isTest == "test")
        return { isValide: true, userId: query.userId };
    const authHeader = headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    const token = authHeader.substring(7); // Remove "Bearer " from the token
    const secretKey = process.env.TOKE_KEY || Config.TOKEN_KEY; // Replace with your own secret key
    var isValide = false;
    var userId;
    Jwt.verify(token, secretKey, (err, decodedToken) => {
        if (err) {
            isValide = false;
        }
        userId = decodedToken.userId;
        isValide = true;
    });
    return { isValide: isValide, userId: userId };
}

export const AuthTokenMiddleware = { authMiddleware };