import { StatusCodes } from "http-status-codes";
import joi from "joi"; 
import validateData from "../../../utils/validateData.js";
import PatientMedicalRecord from "../../../db/models/PatientMedicalRecords.js";
import { BadRequest } from "../../../customErrors/Errors.js";

const joiSchema = joi.object({
    medicalRecordId: joi.string().min(22).required(),
    procedureId: joi.string().min(22).required()
});

const rejectProcedure = async(req, res, next) => {
    try{
        const docId = req.userId; 
        const data = await validateData(joiSchema, req.body); 
        const medRecord = await PatientMedicalRecord.findOne(
            {_id: data['medicalRecordId']},
            { patientFirstName: 0, patientLastName: 0, allDoctorsInvolved: 0, finishedProcedures: 0 }
        ); 
        const awaitingProcedures = medRecord.awaitingProcedures;
        let procedureExists = false;
        let procedureCount = 0;
        for(let i = 0; i < awaitingProcedures.length; i++){
            if(awaitingProcedures[i].providedBy == docId){
                procedureCount++; 
            } 
            if(awaitingProcedures[i].providedBy == docId && awaitingProcedures[i]._id == data['procedureId']){
                procedureExists = true; 
                awaitingProcedures.splice(i,1); 
            }
        }
        if(!procedureExists) throw new BadRequest("This procedure does not exist");
        if(awaitingProcedures.length < 1){
            // if the last awaiting procedure is rejected: 
            const updatedMedRecord = await PatientMedicalRecord.findOneAndUpdate(
                { _id: data['medicalRecordId'] }, 
                { 
                    $set: { status: 'uncompleted' }, 
                    $unset: {allDoctorsInvolved: ''}, 
                    $pull: { awaitingProcedures: { _id: data['procedureId'] } },
                    $push: { rejectedProcedures: data['procedureId'] }
                }, 
                {new: true, projection: {allDoctorsInvolved: 0, patientFirstName: 0, patientLastName: 0, patientId: 0}}
            );   
            return res.status(StatusCodes.OK).json({success: true, medicalRecord: updatedMedRecord})
        }

        // if after rejectring the procedure there is still some left: 
        let newMedRecord;
        if(procedureCount > 1){
            newMedRecord = await PatientMedicalRecord.findOneAndUpdate(
                {_id: data['medicalRecordId']},
                {
                    $pull: { awaitingProcedures: { _id: data['procedureId'] } }, 
                    $push: { rejectedProcedures: data['procedureId'] } },
                {new: true, projection: {patientFirstName: 0, patientLastName: 0, patientId: 0, allDoctorsInvolved: 0}}
            );
            
        }else{
            newMedRecord = await PatientMedicalRecord.findOneAndUpdate(
                {_id: data['medicalRecordId']},
                {
                    $pull: { awaitingProcedures: { _id: data['procedureId'] } }, 
                    $push: { rejectedProcedures: data['procedureId'] }, 
                    $unset: { [`allDoctorsInvolved.${docId}`]: "" }
                },
                {new: true, projection: {patientFirstName: 0, patientLastName: 0, patientId: 0, allDoctorsInvolved: 0}}
            );
            
        }
        return res.status(StatusCodes.OK).json({success: true, medicalRecord: newMedRecord}); 
    }catch(err){
        return next(err); 
    }
}

export default rejectProcedure; 