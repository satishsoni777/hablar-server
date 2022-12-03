import express from "express";
const router=express.Router();

router.get('/call_history',function(req,res){
    res.send({
      message:"Greate, API is Under Dev."
    })
});


router.get('',function(req,res){
  res.send({
    message:"Greate, API is Under Dev."
  })
});

export default router;