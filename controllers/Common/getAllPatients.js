import Patient from "../../db/models/Patient.js";
import { StatusCodes } from "http-status-codes";



const getAllPatients = async(req, res, next) => {
    try{
        return res.status(StatusCodes.OK).json({success: true})
    }catch(err){
        return next(err);
    }
}

export default getAllPatients; 