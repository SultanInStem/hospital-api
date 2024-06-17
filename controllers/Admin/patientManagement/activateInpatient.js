import Payment from "../../../db/models/Payments.js"; 
import Patient from "../../../db/models/Patient.js";
import MedPackage from "../../../db/models/MedPackage.js"; 
import { StatusCodes } from "http-status-codes";
import joi from "joi"; 
import { BadRequest, NotFound, ServerError } from "../../../customErrors/Errors.js";
import validateData from "../../../utils/validateData.js";
import BonusCard from "../../../db/models/BonusCard.js";
import mongoose from "mongoose";
import unixTimeToDays from "../../../utils/unixTimeToDays.js"; 
import User from "../../../db/models/User.js"; 
import { bonusPercentage, mongoIdLength } from "../../../utils/constants.js";


const joiSchema = joi.object({
    packages: joi.array().items(joi.string().min(mongoIdLength)).min(1).required(),
    expiresAt: joi.number().positive().required(), // unix time
    patientId: joi.string().min(mongoIdLength).required(),
    cardId: joi.string().optional(),
    bonusDeduction: joi.number().positive().allow(0).required(),
    paymentMethod: joi.string().valid('Cash', 'Card').required(), 
    PCP: joi.string().min(mongoIdLength).optional() // id of a doctor who will supervise the patient 
})

const activateInpatient = async (req,res, next) => {
    if(isNaN(bonusPercentage)) throw new ServerError("BONUS_PERCENTAGE is not specified in the .env"); 
    const session = await mongoose.startSession();
    session.startTransaction(); 
    let isTransactionFailed = false; 
    try{
        const data = await validateData(joiSchema, req.body);
        const { 
            bonusDeduction, 
            cardId,
            patientId,
            paymentMethod,
            packages,
            expiresAt, 
            PCP 
        } = data; 
        const currentUnix = new Date().getTime();
        if(expiresAt - currentUnix < 0) throw new BadRequest("Expiration date cannot be in the past"); 
        const treatmentDurationDays = unixTimeToDays(expiresAt - currentUnix);

        // validate patient 
        const patient = await Patient.findById(patientId); 
        if(!patient) throw new NotFound(`Patient with ID ${patientId} not found`);
        if(PCP){
            const doc = await User.findById(PCP);
            if(!doc || doc.role !== 'Doctor') throw new NotFound(`Primary care physician (PCP) with ID ${PCP} is not found`);  
            patient.set({PCP: PCP}); 
        }else{
            if(!patient.PCP) throw new BadRequest("Patient does not have a supervising docotor. Please provide PCP"); 
        }
        patient.set({ packages: packages, expiresAt: expiresAt }); 
        await patient.save({session}); 
        // ---- 

        // get the packages and calculate the price 
        let netPrice = 0; 
        for(let i = 0; i < packages.length; i++){
            const id = packages[i]; 
            const medPackage = await MedPackage.findById(id);
            if(!medPackage) throw new NotFound(`Package with ID ${id} not found`); 
            netPrice += (medPackage.price * treatmentDurationDays); 
        }
        if(netPrice < bonusDeduction) throw new BadRequest("Bonus deduction cannot exceed the net price");
        if(cardId){  // if cardId is prvided, calculate adjustment and update the balance
            const adjustment = -bonusDeduction + (netPrice - bonusDeduction) * bonusPercentage;
            const bonusCard = await BonusCard.findByIdAndUpdate(cardId, 
                { $inc: { balance: adjustment } }, 
                { new: false, session }
            );
            if(!bonusCard) throw new NotFound(`Bonus card with ID ${cardId} not found`);
            else if(bonusDeduction > bonusCard.balance) throw new BadRequest("Bonus card does not have sufficient funds");
        }

        const paymentData = {
            paymentMethod,
            patientId,
            amountBeforeDeduction: netPrice,
            bonusDeduction,
            amountFinal: netPrice - bonusDeduction,
            packagesPaid: packages, 
            createdAt: currentUnix
        }; 
        const payment = await Payment.create([paymentData], {session, new: true}); // create payment record  
        if(!payment) throw new BadRequest("Payment was unsuccessful"); 
        
        await session.commitTransaction(); 
        const response = {
            success: true, 
            patient
        }
        return res.status(StatusCodes.OK).json(response); 
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

export default activateInpatient;