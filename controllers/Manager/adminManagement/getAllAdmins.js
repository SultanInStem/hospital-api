import { StatusCodes } from "http-status-codes";
import User from "../../../db/models/User.js";


const getAllAdmins = async(req, res, next) => {
    try{
        const admins = await User.find({isAdmin: true}); 
        return res.status(StatusCodes.OK).json({success: true, admins}); 
    }catch(err){
        return next(err); 
    }
}

export default getAllAdmins; 