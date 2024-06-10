import Patient from "../../../db/models/Patient.js";
import { StatusCodes } from "http-status-codes";

const getAllPatients = async(req, res, next) => {
    try{
        const projection = {
            phoneNumber: 0, 
            uniqueId: 0, 
            dateOfBirth: 0, 
            notes: 0,
            gender: 0
        };
        const patients = await Patient.find({}, projection); 
        return res.status(StatusCodes.OK).json({success: true, patients});
    }catch(err){
        return next(err);
    }
}

export default getAllPatients; 