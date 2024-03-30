import { StatusCodes } from "http-status-codes";
import joi from "joi"; 
import Service from "../../../db/models/Service.js"; 
import PatientMedicalRecord from "../../../db/models/PatientMedicalRecords.js";
import validateData from "../../../utils/validateData.js"; 
import { NotFound } from "../../../customErrors/Errors.js";
const joiSchema = joi.object({
    procedureId: joi.string().required().min(24),
    medicalRecordId: joi.string().required().min(24)
})

const completeProcedure = async (req, res, next) => {
    try{
        const docId = req.userId; 
        const data = await validateData(joiSchema, req.body);
        let medRecord = await PatientMedicalRecord.findOneAndUpdate(
            { _id: data['medicalRecordId'] }, 
            { $pull: { awaitingProcedures: { _id: data['procedureId'] } }, $push: { finishedProcedures: data['procedureId'] } },
            { new: true, projection: {allDoctorsInvolved: 0, patientFirstName: 0, patientLastName: 0} }
        ); 
        if(!medRecord) throw new NotFound("Medical record with this ID not found");
        const awaitingProcedures = medRecord.awaitingProcedures; 
        let isListEmpty = false 
        for(let i = 0; i < awaitingProcedures.length; i++){
            if(awaitingProcedures[i].providedBy === docId) {
                isListEmpty = false; 
                break; 
            };
            isListEmpty = true; 
        }

        if(isListEmpty){
            medRecord = await PatientMedicalRecord.findOneAndUpdate(
                { _id: data['medicalRecordId'] }
            );
        }
        if(awaitingProcedures.length < 1){
            // update the status 
            medRecord = await PatientMedicalRecord.findOneAndUpdate(
                { _id: data['medicalRecordId'] }, 
                { $set: { status: "completed" } },
                {new: true, projection: {allDoctorsInvolved: 0, patientFirstName: 0, patientLastName: 0} }
            );
        }
        return res.status(StatusCodes.OK).json({ success: true, medRecord });
    }catch(err){
        return next(err); 
    }
}

export default completeProcedure; 