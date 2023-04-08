import express from 'express'
import { AuthController } from '../controller/auth_controller.js';
const router = express.Router();

router.post("/sign_up", AuthController.SignUp);

router.post("/sign_in", AuthController.SignIn);

router.post("/validate-token", AuthController.validatedToken)

router.post("/sendOtp", AuthController.sendMail)

export default router;