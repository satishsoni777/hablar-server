import express from 'express'
import { inserOneData } from '../db/mongoose_db.js';
import { Users } from '../models/users.js';
const router = express.Router();

router.post("/user_profile", function (req, res) {
    console.log("Getting request")
    inserOneData(req.body).then((e) => {
        console.log(e);
    });
    res.send({});

 
});
router.post("/sign_up", function (req, res) {
    
    try {
        var users = Users({
            name:res.body.name,
            email_id:res.body.email_id
        });
        inserOneData(users).then((v) => {
            res.send({
                "succes": "not bad",
                "message":v
            })
        }).catch((e) => {
            res.statusCode=401;
            res.send({
                "failed": "bad",
                "error":e
            })
        });
    }
    catch (e) {
        res.statusCode=501; 
        res.send({ failed: "bad",error:e })
    }

});

export default router;