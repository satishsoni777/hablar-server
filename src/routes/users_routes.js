import express from 'express'

import { UserController } from '../controller/users_controller.js';
import { EndPoints } from './endpoint.js';

const router = express.Router();

router.get(EndPoints.userList, UserController.getAllUsers);

router.get("/userDetails", UserController.getUserDetails)

router.post("/updateUserData", UserController.updateUserData)

router.get("/testServer", UserController.testServer)




export default router;
