import Patient from "../../db/models/Patient.js";
import { StatusCodes } from "http-status-codes";



const getAllPatients = async(req, res, next) => {
    try{
        const patients = await Patient.find(); 
        return res.status(StatusCodes.OK).json({success: true, patients});
    }catch(err){
        return next(err);
    }
}

export default getAllPatients; 