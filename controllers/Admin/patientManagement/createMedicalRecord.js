import { StatusCodes } from "http-status-codes";
import { BadRequest, NotFound, ServerError } from "../../../customErrors/Errors.js";
import Payment from "../../../db/models/Payments.js";
import joi from "joi"; 
import Service from "../../../db/models/Service.js";
import PatientMedicalRecord from "../../../db/models/PatientMedicalRecords.js";
import Patient from "../../../db/models/Patient.js";
import validateData from "../../../utils/validateData.js";
import BonusCard from "../../../db/models/BonusCard.js";
import mongoose from "mongoose";

const bonusPercentage = Number(process.env.BONUS_PERCENTAGE);

const joiSchema = joi.object({
    cardId: joi.string().optional(),
    paymentMethod: joi.string().valid('Cash','Card').required(),
    servicePrice: joi.number().min(0).required(),
    serviceTitle: joi.string().required(), 
    patientId: joi.string().min(Number(process.env.MONGO_MIN_ID_LENGTH)).required(), 
    serviceId: joi.string().min(Number(process.env.MONGO_MIN_ID_LENGTH)).required(),
    bonusDeduction: joi.number().min(0).allow(0).required()
})

const createMedicalRecord = async(req,res, next) => {
    if(isNaN(bonusPercentage)) throw new ServerError('BONUS_PERCENTAGE is not a number');
    const session = await mongoose.startSession(); 
    session.startTransaction(); 
    let isTransactionFailed = false;
    try{
        const data = await validateData(joiSchema, req.body); 
        const { 
            serviceId, 
            patientId, 
            paymentMethod, 
            cardId, 
            bonusDeduction,
            servicePrice, 
            serviceTitle 
        } = data;
        if(servicePrice - bonusDeduction < 0) throw new BadRequest('Bonus deduction cannot exceed the price of the service');
        // check if patient exists 
        const currentUnix = new Date().getTime(); 
        const patient = await Patient.findByIdAndUpdate(patientId,
            { $set: { lastSeen: currentUnix } }
        );
        if(typeof patient === 'undefined' || patient === null) throw new NotFound("Patient not found, create the patient");
        //--------
         

        const bonusCard = await BonusCard.findOne({cardId: cardId}); 
        if(bonusCard && bonusCard.balance < bonusDeduction) throw new BadRequest("Bonus deduction cannot exceed the balance on the card");
        // const adjustment = (bonusCard.balance - bonusDeduction) + (servicePrice - bonusDeduction) * bonusPercentage;

        // create payment record
        const paymentData = {
            patientId: patientId,
            amountBeforeDeduction: servicePrice,
            bonusDeduction: bonusDeduction,
            amountFinal: servicePrice - bonusDeduction,
            servicePaid: serviceId,
            paymentMethod: paymentMethod,
            bonusCardId: cardId ? cardId : null,
            createdAt: new Date().getTime()
        };
        const payment = new Payment(paymentData); 
        if(!payment) throw new BadRequest('Payment was unsuccessful');
        await payment.save({ session }); 
        //------


        // Create med-record and add it to the queue of the service
        const medRecordData = {
            isInpatient: false,
            serviceTitle,
            patientId,
            patientFirstName: patient.firstName,
            patientLastName: patient.lastName,
            paymentRecord: payment['_id'],
            status: 'queue',
            serviceId: serviceId,
            createdAt: new Date().getTime(),
            queueNum: 1
        }
        const medRecord = new PatientMedicalRecord(medRecordData);
        
        if(!medRecord) throw new BadRequest("Medical record hasn't been created");
        const service = await Service.findOneAndUpdate({_id: serviceId},
            {
                $push: {currentQueue: medRecord['_id']}
            }, 
            {
                session, 
                new: false,
                projection: {
                    createdAt: 0,
                    updatedAt: 0,
                    title: 0,
                    description: 0
                }
            }
        );        
        if(!service) throw new BadRequest("Failed to update the service");

        // queue numbering for a service 
        if(service.currentQueue.length === 0){
            medRecord.set({queueNum: 1}); 
        }else{
            const lastRecordId = service.currentQueue[service.currentQueue.length - 1]; 
            const lastRecord = await PatientMedicalRecord.findById(lastRecordId);
            medRecord.set({queueNum: lastRecord.queueNum + 1 });
        }
        // -------
        await medRecord.save({session}); 
        // -------
        await session.commitTransaction(); 
        return res.status(StatusCodes.OK).json({success: true, medicalRecord: medRecord, payment});
    }catch(err){
        isTransactionFailed = true;
        return next(err); 
    }finally{
        if(isTransactionFailed){
            await session.abortTransaction(); 
        }
        await session.endSession();
    }
}

export default createMedicalRecord; 