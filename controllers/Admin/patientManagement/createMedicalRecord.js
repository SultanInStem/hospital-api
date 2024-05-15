import { StatusCodes } from "http-status-codes";
import { BadRequest, NotFound } from "../../../customErrors/Errors.js";
import Payment from "../../../db/models/Payments.js";
import joi from "joi"; 
import Service from "../../../db/models/Service.js";
import PatientMedicalRecord from "../../../db/models/PatientMedicalRecords.js";
import Patient from "../../../db/models/Patient.js";
import validateData from "../../../utils/validateData.js";
import mongoose from "mongoose";
const bonusPercentage = Number(process.env.BONUS_PERCENTAGE);
const joiSchema = joi.object({
    adjustment: joi.number().required(),
    patientId: joi.string().min(Number(process.env.MONGO_MIN_ID_LENGTH)).required(), 
    serviceId: joi.string().min(20).required(),
})

const createMedicalRecord = async(req,res, next) => {
    const session = await mongoose.startSession(); 
    session.startTransaction(); 
    let isTransFailed = false; 
    try{
        const data = await validateData(joiSchema, req.body); 
        const serviceId = data['serviceId']; 
        const patientId = data['patientId']; 

        // check if patient exists 
        const patient = await Patient.findById(data['patientId'], 
        {
            uniqueId: 0, 
            phoneNumber: 0, 
            createdAt: 0, 
            updatedAt: 0, 
            dateOfBirth: 0,
            gender: 0
        });

        if(typeof patient === 'undefined' || patient === null) throw new NotFound("Patient not found, create the patient");
        //-------------------------- 

        // Add patient to the queue in each service
        let netTotal = 0; 
        //----------------------

        // Create Payment Record
        if(bonusToUse > netTotal) throw new BadRequest("Used bonus cannot exceed the net total"); 
        const amountPaid = netTotal - bonusToUse; 
        const paymentData = {
            patientId,
            initialAmount: netTotal,
            bonusDeduction: bonusToUse,
            amountPaid: amountPaid,
            paidServices: []
        };
        const newlyGainedBonus = amountPaid * bonusPercentage + (patient.bonusAvailable - bonusToUse);
        await Patient.findByIdAndUpdate(patientId,{bonusAvailable: newlyGainedBonus}, {session}); 
        // const paymentRecord = await Payment.create({});
        //-------------------------- 

        await session.commitTransaction();
        return res.status(StatusCodes.OK).json({success: true});
    }catch(err){
        isTransFailed = true; 
        return next(err); 
    }finally{
        if(isTransFailed){
            await session.abortTransaction(); 
        }
        await session.endSession();
    }
}

export default createMedicalRecord; 