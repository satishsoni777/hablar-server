import express from 'express'
import { user } from 'firebase-functions/v1/auth';
import { MongoDb } from '../db/mongoose_db.js';
import { Users } from '../models/users.js';
const router = express.Router();

router.post("/user_profile", function (req, res) {
    console.log("Getting request")

    res.send({});


});
router.get("/user_list", function (req, res) {
    Users.find().lean().exec(function (err, users) {
        if (err) {
            res.statusCode = 401;
            res.send({
                "failed": "not found"
            })
        }
        else
            return res.send(JSON.stringify(users));
    });


})
router.post("/sign_up", function (req, res) {
    try {
        var users = new Users(req.body);
        users.save().then((d) => {
            res.statusCode = 200;
            res.send({
                "success": true,
                "data": d
            })
        }).catch((e) => {
            if (e.code == 11000) {
                res.statusCode = 409;
                res.send({
                    "success": "Failed",
                    "data": req.body,
                    "message": {
                        "error": req.body.email_id != null ? "User email address already registered." : "Mobile number already registered"
                    }
                })
            }
            else {
                res.statusCode = 400;
                res.send({
                    "succes": "Failed",
                    "message": e
                })
            }
        });
    }
    catch (e) {
        res.statusCode = 400;
        res.send({ failed: "bad request", error: e })
    }

});

export default router;