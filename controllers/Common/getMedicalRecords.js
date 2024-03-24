import PatientMedicalRecord from "../../db/models/PatientMedicalRecords.js";
import { StatusCodes } from "http-status-codes";

const getMedicalRecords = async(req, res, next) => {
    try{
        const { id } = req.params; 
        const records = await PatientMedicalRecord.find({patientId: id}); 
        return res.status(StatusCodes.OK).json({success: true, records})
    }catch(err){
        return next(err);
    }
}

export default getMedicalRecords; 