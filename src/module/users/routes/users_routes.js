import express from 'express'

import { UserController } from '../controller/users_controller.js';

const router = express.Router();

router.get("/v1/user_list", UserController.getAllUsers);

router.get("/user_details", UserController.getUserDetails)

router.post("/v1/update__user_data", UserController.updateUserData)

router.post("/v1/update_userdetails", UserController.updateUserData)

router.get("/v1/test_server", UserController.testServer)

router.get("/v1/get_token", UserController.getToken)

export default router;
