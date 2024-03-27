import { StatusCodes } from "http-status-codes";
import PatientMedicalRecord from "../../../db/models/PatientMedicalRecords.js";


const getAllPendingRecords = async(req, res, next) => {
    try{
        const docId = req.userId;
        const medicalRecords = await PatientMedicalRecord.find({
            status: 'pending',
            [`allDoctorsInvolved.${docId}`]: { $exists: true }
        }, { totalPrice: 0, allDoctorsInvolved: 0, awaitingTreatment: 0 }).sort({ createdAt: 1 }) 
        return res.status(StatusCodes.OK).json({success: true, queue: medicalRecords})
    }catch(err){
        return next(err); 
    }
}

export default getAllPendingRecords; 

