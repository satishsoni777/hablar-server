import express from 'express'
import { inserOneData } from '../db/mongoose_db.js';

const router = express.Router();

router.post("/user_profile", function (req, res) {
    console.log("Getting request")
    inserOneData(req.body).then((e) => {
        console.log(e);
    });

    // if(e){

    // }
    // else
    // res.send({
    //     "succes":"not bad"
    // })
});
router.post("/create_user", function (req, res) {
    console.log("Getting request")
    try {
        inserOneData(req.body).then((v) => {
            res.send({
                "succes": "not bad"
            })
        }).catch((e) => {
            res.send({
                "failed": "bad"
            })
        });
    }
    catch (e) {
        res.send({ "failed": "bad" })
    }

});

export default router;