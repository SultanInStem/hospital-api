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
const bonusPercentage = Number(process.env.BONUS_PERCENTAGE); 
const MIN_ID_LENGTH = Number(process.env.MONGO_MIN_ID_LENGTH); 
const joiSchema = joi.object({
    packages: joi.array().items(joi.string().min(MIN_ID_LENGTH)).min(1).required(),
    expiresAt: joi.number().positive().required(), // unix time
    patientId: joi.string().min(MIN_ID_LENGTH).required(),
    cardId: joi.string().optional(),
    bonusDeduction: joi.number().positive().allow(0).required(),
    paymentMethod: joi.string().valid('Cash', 'Card').required()
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
            expiresAt 
        } = data; 
        const currentUnix = new Date().getTime();
        if(expiresAt - currentUnix < 0) throw new BadRequest("Expiration date cannot be in the past"); 
        const treatmentDurationDays = unixTimeToDays(expiresAt - currentUnix);

        // get the packages and calculate the price 
        let netPrice = 0; 
        for(let i = 0; i < packages.length; i++){
            const id = packages[i]; 
            const medPackage = await MedPackage.findById(id);
            if(!medPackage) throw new NotFound(`Package with ID ${id} not found`); 
            netPrice += (medPackage.price * treatmentDurationDays); 
        }
        if(netPrice < bonusDeduction) throw new BadRequest("Bonus deduction cannot exceed the net price");
        if(cardId){  // if cardId is prvided, calcualte adjustment and update the balance
            const adjustment = -bonusDeduction + (netPrice - bonusDeduction) * bonusPercentage;
            const bonusCard = await BonusCard.findByIdAndUpdate(cardId, 
                { $inc: { balance: adjustment } }, 
                { new: false, session }
            );
            if(!bonusCard) throw new NotFound(`Bonus card with ID ${cardId} not found`);
            else if(bonusDeduction > bonusCard.balance) throw new BadRequest("Bonus card does not possess sufficient funds");
        }
        
        const patient = await Patient.findByIdAndUpdate(patientId,  // update the patient 
        { $set: { packages: packages, expiresAt: expiresAt} },
        { new: true, session }
        );
        if(!patient.isStationary) throw new BadRequest(`Patient with ID ${patientId} is not stationary`); 
        else if(!patient) throw new NotFound(`Patient with ID ${patientId} not found`);
    
        const paymentData = {
            paymentMethod,
            patientId,
            amountBeforeDeduction: netPrice,
            bonusDeduction,
            amountFinal: netPrice - bonusDeduction,
            packagesPaid: packages
        }; 
        const payment = await Payment.create([paymentData], {session, new: true}); // create payment record  
        if(!payment) throw new BadRequest("Payment was unsuccessful"); 

        await session.commitTransaction(); 
        return res.status(StatusCodes.OK).json({success: true}); 
    }catch(err){
        return next(err); 
    }finally{
        if(isTransactionFailed){
           await session.abortTransaction();
        }
        await session.endSession(); 
    }
}

export default activateInpatient;