import express from 'express'
import { AuthController } from '../controller/auth_controller.js';
const router = express.Router();

// router.post("/signUp", AuthController.SignUp);

router.post("/v1/signup", AuthController.SignUp);

router.post("/v1/signin", AuthController.SignIn);

router.post("/v1/validate_token", AuthController.validatedToken)

router.post("/v1/send_otp", AuthController.sendMail)

export default router;