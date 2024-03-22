import User from '../../../db/models/User.js';
import { Unauthorized } from '../../../customErrors/Errors.js';
import { StatusCodes } from 'http-status-codes';

const getDoctors = async (req, res, next) => {
    try{
        if(!req.isAdmin) throw new Unauthorized("Not authorized to view doctors"); 
        const doctors = await User.find({role: "Doctor"});
        return res.status(StatusCodes.OK).json({success: true, doctors});
    }catch(err){
        return next(err); 
    }
}

export default getDoctors; 