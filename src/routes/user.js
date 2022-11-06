import express from 'express'

const router=express.Router();

router.post("/user_profile",function(req,res){
    res.send({
        "succes":"not bad"
    })
});

export default router;