import { StatusCodes } from "http-status-codes";
import PatientMedicalRecord from "../../../db/models/PatientMedicalRecords.js";

const getOnePendingRecord = async(req, res, next) => {
    try{
        const docId = req.userId; 
        const { id } = req.params; 
        const record = await PatientMedicalRecord.findOne({_id: id}, {totalPrice: 0, allDoctorsInvolved: 0}); 
        const awaitingProcedures = record.awaitingProcedures; 
        const docSpecProcedures = []
        for(let i = 0; i < awaitingProcedures.length; i++){
            if(awaitingProcedures[i].providedBy == docId){
                docSpecProcedures.push(awaitingProcedures[i]); 
            }
        }
        const payload = {
            procedures: docSpecProcedures,
            patientId: record.patientId
        }
        return res.status(StatusCodes.OK).json({success: true, ...payload, medicalRecordId: id});
    }catch(err){
        return next(err); 
    }
}
export default getOnePendingRecord; 