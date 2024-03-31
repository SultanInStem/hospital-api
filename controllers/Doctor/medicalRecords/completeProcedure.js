import { StatusCodes } from "http-status-codes";
import joi from "joi"; 
import PatientMedicalRecord from "../../../db/models/PatientMedicalRecords.js";
import validateData from "../../../utils/validateData.js"; 
import { BadRequest, NotFound } from "../../../customErrors/Errors.js";
import rejectProcedure from "./rejectProcedure.js";
const joiSchema = joi.object({
    procedureId: joi.string().required().min(24),
    medicalRecordId: joi.string().required().min(24)
})

const completeProcedure = async (req, res, next) => {
    try{
        const docId = req.userId; 
        const data = await validateData(joiSchema, req.body);
        let medRecord = await PatientMedicalRecord.findOne(
            {_id: data['medicalRecordId']}, 
            {patientFirstName: 0, patientLastName: 0, patientId: 0, allDoctorsInvolved: 0, rejectedProcedures: 0, finishedProcedures: 0}); 

        if(!medRecord) throw new NotFound("Medical record with this ID not found");
        const awaitingProcedures = medRecord.awaitingProcedures; 
        let isListEmpty = false;
        let procedureExists = false;  
        // check if doctor has more procedures to complete, and if the procedure id is valid
        for(let i = 0; i < awaitingProcedures.length; i++){
            if(awaitingProcedures[i]._id == data["procedureId"] && awaitingProcedures[i].providedBy == docId){
                isListEmpty = false; 
                procedureExists = true;
            }
        }
        if(!procedureExists) throw new BadRequest("Invalid procedure ID"); 
        medRecord = await PatientMedicalRecord.findOneAndUpdate(
            { _id: data['medicalRecordId'] }, 
            { $pull: { awaitingProcedures: { _id: data['procedureId'] } }, $push: { finishedProcedures: data['procedureId'] } },
            { new: true, projection: {allDoctorsInvolved: 0, patientFirstName: 0, patientLastName: 0, allDoctorsInvolved: 0 } });

     
        if(medRecord.awaitingProcedures.length < 1 && medRecord.rejectedProcedures.length < 1){
            // finished all procedures without rejections 
            medRecord = await PatientMedicalRecord.findOneAndUpdate(
                { _id: data['medicalRecordId'] },
                { $set: { status: "completed" }, $unset: { allDoctorsInvolved: "" } },
                { new: true, projection: { patientFirstName: 0, patientLastName: 0, allDoctorsInvolved: 0  } }
            );
        }else if(medRecord.awaitingProcedures.length < 1 && medRecord.rejectedProcedures.length >= 1){
            // finished all procedures, but there were some rejected ones
            medRecord = await PatientMedicalRecord.findOneAndUpdate(
                { _id: data['medicalRecordId'] },
                { $set: { status: "uncompleted" }, $unset: { allDoctorsInvolved: "" } },
                { new: true, projection: { patientFirstName: 0, patientLastName: 0, allDoctorsInvolved: 0  } }
            );
        }else if(isListEmpty && medRecord.awaitingProcedures.length > 0){
            // one doctor has finished procedures but others have not
            medRecord = await PatientMedicalRecord.findOneAndUpdate(
                { _id: data['medicalRecordId'] },
                { $unset: { [`allDoctorsInvolved.${docId}`]: "" } },
                { new: true, projection: { patientFirstName: 0, patientLastName: 0, allDoctorsInvolved: 0  } }
            );
        }


        return res.status(StatusCodes.OK).json({ success: true, medicalRecord: medRecord });
    }catch(err){
        return next(err); 
    }
}

export default completeProcedure; 