import express from 'express'

import { UserController } from '../controller/users_controller.js';

const router = express.Router();

router.get("/user_list", UserController.getAllUsers);

router.get("/user_details", UserController.getUserDetails)




export default router;
