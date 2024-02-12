import Doctor from '../../db/models/Doctor.js'; 
import { Unauthorized, BadRequest } from '../../customErrors/Errors.js';
import { StatusCodes } from 'http-status-codes';

const getDoctors = async (req, res, next) => {
    try{
        const adminId = req.userId; 
        // const admin = await Admin.findById(adminId); 
        // if(!admin || !adminId) throw new Unauthorized("Admin cannot be found"); 
        const doctors = await Doctor.find(); 
        return res.status(StatusCodes.OK).json({success: true, doctors})
    }catch(err){
        return next(err); 
    }
}

export default getDoctors; 