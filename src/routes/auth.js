import express from "express";
const router=express.Router();
const users=[];

// All routes in here are starting with /users

router.post("/login",(req,res)=>{
    const firebaseToken=req.body.token;
    console.log(req.body);
    res.send({
        "message":"Log in Successfully"
    })
});

router.get("/getdata",(req,res)=>{
    res.send("Hello this is Auth route")
});


router.get("/:id",(req,res)=>{
    const{id}=req.params;
    const foundUser=users.find((user)=>user.id===id);
    if(!foundUser){
        res.statusCode=401;
        res.send({
            "status":"failure",
            "message":"sorry  could not found the data"
        });
    }
    else
    res.send(foundUser);
});

router.patch("/:id",(req,res)=>{
    const id=req.params.id;
    console.log(id);    
    const user=users.find((user)=>user.id===id)
    res.send("Yes nice man")
})

router.delete("/:id",(req,res)=>{
    const {id}=req.params;
    users=users.filter((user)=>user.i!=id);
})

router.post('/save-data',(req,res)=>{
    const body=req.body;
    const usrerId=uuidv4();
    console.log(req.body);
    users.push({...body,id:usrerId});
    res.send("Success data saved to the db")
})


export default router;