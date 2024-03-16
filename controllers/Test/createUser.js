import User from "../../db/models/User.js";
import { StatusCodes } from "http-status-codes";
const createUser = async(req,res, next) => {
    try{
        const {username, password, isAdmin, specialty} = req.body; 
        const user = await User.create({isAdmin,username,password, specialty})
        await user.validate();
        console.log(user); 
        return res.status(StatusCodes.OK).json({success: true, msg: "yay"});
    }catch(err){
        return next(err); 
    }
}

export default createUser; 