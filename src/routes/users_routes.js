import express from 'express'

import { UserController } from '../controller/users_controller.js';

const router = express.Router();

router.get("/user_list", UserController.getAllUsers);


export default router;
