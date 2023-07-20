import express from 'express'

import { UserController } from '../controller/users_controller.js';

const router = express.Router();

router.get("/userList", UserController.getAllUsers);

router.get("/userDetails", UserController.getUserDetails)

router.get("/testServer", UserController.testServer)




export default router;
