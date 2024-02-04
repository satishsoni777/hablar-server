import express from 'express'
import { AuthController } from '../controller/auth_controller.js';
const router = express.Router();

router.post("/signUp", AuthController.SignUp);

router.post("/signup", AuthController.SignUp);

router.post("/signIn", AuthController.SignIn);

router.post("/signin", AuthController.SignIn);

router.post("/validateToken", AuthController.validatedToken)

router.post("/validate_token", AuthController.validatedToken)

router.post("/sendOtp", AuthController.sendMail)

router.post("/send_otp", AuthController.sendMail)

export default router;