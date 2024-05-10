import { StatusCodes } from "http-status-codes";
import { BadRequest, NotFound } from "../../../customErrors/Errors.js";
import Payment from "../../../db/models/Payments.js";
import joi from "joi"; 
import Service from "../../../db/models/Service.js";
import PatientMedicalRecord from "../../../db/models/PatientMedicalRecords.js";
import Patient from "../../../db/models/Patient.js";
import validateData from "../../../utils/validateData.js";
import mongoose from "mongoose";

const joiSchema = joi.object({
    usedBonus: joi.number().min(0).allow(0).required(),
    patientId: joi.string().min(Number(process.env.MONGO_MIN_ID_LENGTH)).required(), 
    services: joi.array().min(1).items(joi.string()), // the ID's of the services   
})

const createMedicalRecord = async(req,res, next) => {
    const session = await mongoose.startSession(); 
    session.startTransaction(); 
    let isTransFailed = false; 
    try{
        const data = await validateData(joiSchema, req.body); 
        const serviceIDs = data['services']; 
        const patientId = data['patientId']; 
        const usedBonus = data['usedBonus']; 

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
        if(typeof patient === 'undefined' || patient === null) throw new NotFound("Patient not found");
        //-------------------------- 

        // Add patient to the queue in each service
        let netTotal = 0; 
        const paidServices = [];
        for(let i = 0; i < serviceIDs.length; i++){
            const id = serviceIDs[i];
            const currentTime = new Date(); 
            const patientObj = {
                createdAt: currentTime,
                patientId: patientId,
                fullName: patient.firstName + ' ' + patient.lastName
            };
            const condition = {
                _id: id,
                isAvailable: true
            }
            const service = Service.findOneAndUpdate(
                condition, 
                {$push: {currentQueue: patientObj}}, 
                {session, new: true, projection: {description: 0}}
            );
            if(typeof service === 'undefined' || service === null) throw new NotFound("Service not found");
            netTotal += service.price; 
            paidServices.push(); // LEFT OFF HERE!!!
        }

        // Create Payment Record
        if(usedBonus > netTotal) throw new BadRequest("Used bonus cannot exceed the net total");
        const paymentData = {
            patientId,
            initialAmount: netTotal,
            bonusDeduction: usedBonus,
            amountPaid: netTotal - usedBonus,
            paidServices: []
        };
        const paymentRecord = await Payment.create({});
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