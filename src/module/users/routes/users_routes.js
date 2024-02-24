import express from 'express'

import { UserController } from '../controller/users_controller.js';

const router = express.Router();

router.get("/user_list", UserController.getAllUsers);

router.get("/user_details", UserController.getUserDetails)

router.post("/update__user_data", UserController.updateUserData)

router.post("/update_userdetails", UserController.updateUserData)

router.get("/test_server", UserController.testServer)

router.get("/get_token", UserController.getToken)

export default router;