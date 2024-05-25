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
            servicePrice 
        } = data;
        console.log(data);
        if(servicePrice - bonusDeduction < 0) throw new BadRequest('Bonus deduction cannot exceed the price of the service');
        // check if patient exists 
        const patient = await Patient.findById(patientId, 
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
         

        // if bonus card exists, make sure the bonusDeduction does exceed the banalce on the card
        // and the balance of the card
        const bonusCard = await BonusCard.findOne({cardId: cardId});
        if(bonusCard){
            if(bonusCard.balance < bonusDeduction) throw new BadRequest("Bonus deduction cannot exceed the balance on the card");
            const adjustment = (bonusCard.balance - bonusDeduction) + (servicePrice - bonusDeduction) * bonusPercentage;
            const updatedBonusCard = await BonusCard.findOneAndUpdate(
                {cardId: cardId}, 
                {balance: adjustment},
                {session}
            );
        }
        //--------------------------

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
        //----------------------


        // Create med-record and add it to the queue of the service
        const medRecordData = {
            patientId,
            patientFirstName: patient.firstName,
            patientLastName: patient.lastName,
            paymentRecord: payment['_id'],
            status: 'queue',
            serviceId: serviceId,
            createdAt: new Date().getTime()
        }
        const medRecord = new PatientMedicalRecord(medRecordData);
        await medRecord.save({session}); 
        if(!medRecord) throw new BadRequest("Medical record hasn't been created");
        const service = await Service.findOneAndUpdate({_id: serviceId},
            {
                $push: {currentQueue: medRecord['_id']}
            }, 
            {
                session, 
                new: true,
                projection: {
                    createdAt: 0,
                    updatedAt: 0,
                    title: 0,
                    description: 0
                }
            }
        );
        if(!service) throw new BadRequest("Failed to update the service");
        // ----------------------------
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