import express from "express";
import jwt from 'jsonwebtoken';
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