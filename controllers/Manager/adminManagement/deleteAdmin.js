import { StatusCodes } from "http-status-codes";
import User from "../../../db/models/User.js"; 
import { NotFound } from "../../../customErrors/Errors.js";

const deleteAdmin = async(req, res, next) => {
    try{
        const { id } = req.params; 
        const admin = await User.findOneAndDelete({isAdmin: true, _id: id}); 
        if(!admin) throw new NotFound("Admin not found");  
        return res.status(StatusCodes.OK).json({success: true}); 
    }catch(err){
        return next(err); 
    }
}

export default deleteAdmin; 