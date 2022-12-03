import express from "express";
import jwt from 'jsonwebtoken';
import { inserOneData } from '../db/mongoose_db.js';
import { UsersData } from '../models/auth.js';
const router = express.Router();


router.post("/sign_in", (req, res) => {
    try {
        const token = jwt.sign({
            mobile: req.body.mobile,
            password: req.body.password
        }, "this is my sercet code", { expiresIn: '24h' },)
        if (!token) {
            res.status(401).send({
                error: "try later,"
            })
        }
        res.send({
            message: "Log in Successfully",
            token: token
        })
    }
    catch (e) {
        res.status(401).send(e);
    }
});

router.post("login", (req, res) => {
    var userData=UsersData({
        name:req.body.name,
        email_id:req.body.email_id
    });
    inserOneData(userData);
    res.status(200).send({
        message: "Data saved",

    })
});

router.post("/sign_up", (req, res) => {
    res.status(200).send({})
});


router.post("forget_password", (req, res) => {
    res.send({});
});



router.patch("/:id", (req, res) => {
    const id = req.params.id;
    console.log(id);
    res.send("Yes nice man")
})



export default router;