import express from "express";

const router = express.Router();


router.get("/hello", function (req, res) {
    res.send({
        message: "Hello Duniya"
    })
});
export default router;