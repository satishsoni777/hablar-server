import { Users } from "../models/users.js";


const getAllUsers = async (req, res,) => {
    console.log("get All users");
    const pageNo = req.body.page_no;
    const pageSize = req.body.page_size;
    var lowerLimit, upperLimit;
    if (pageNo == 1) {
        lowerLimit = 1;
    }
    else {
        lowerLimit = (pageNo - 1) * pageSize;
    }
    upperLimit = pageNo == 1 ? pageSize : (pageNo - 1) * pageSize + pageSize;
    console.log(lowerLimit, upperLimit)
    Users.find().skip(lowerLimit == 1 ? 0 : lowerLimit).limit(upperLimit).lean().exec(function (err, users) {
        if (err) {
            res.statusCode = 401;
            res.send({
                "failed": "not found"
            })
        }
        else
            return res.status(200).send({
                success:true,
                users:users
            });
    });
}
const getUserDetails=(req,res,next)=>{
    
}
export const UserController = { getAllUsers, getUserDetails }