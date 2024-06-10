import PatientMedicalRecord from "../../../db/models/PatientMedicalRecords.js";
import { StatusCodes } from "http-status-codes";
import Service from "../../../db/models/Service.js";
import Payment from "../../../db/models/Payments.js";
import { BadRequest, NotFound, ServerError } from "../../../customErrors/Errors.js";
import BonusCard from "../../../db/models/BonusCard.js";
import mongoose, { mongo } from "mongoose";
const bonusPercentage = Number(process.env.BONUS_PERCENTAGE);
const completeRecord = async(req, res, next) => {
    const session = await mongoose.startSession(); 
    session.startTransaction(); 
    let isTransactionFailed = false; 
    try{
        if(isNaN(bonusPercentage)) throw new ServerError("ENV variable failed at completeRecord.js");
        const { id } = req.params; 
        const recordProj = {
            paymentRecord: 0, 
            patientFirstName: 0, 
            patientLastName: 0, 
            patientId: 0
        }
        const medRecord = await PatientMedicalRecord.findByIdAndUpdate(id,
            { $set: { status: "completed" } }, 
            { new: false, projection: recordProj }
        ); 
        if(!medRecord) throw new NotFound("Medical Record Not Found");
        else if(medRecord.status !== 'queue') throw new BadRequest("This record cannot be completed");
        
        // remove the record from the currentQueue of the service 
        const service = await Service.findOneAndUpdate({_id: medRecord.serviceId}, 
            { $pull: { currentQueue: id } },
            { new: true }
        );

        // if record is about to be closed, deposit the bonus 
        if(!medRecord.isInpatient){
            const paymentId = medRecord['paymentRecord']; 
            const payment = await Payment.findById(paymentId);
            if(!payment) throw new NotFound("Payment Record not found");
            const cardId = payment['bonusCardId'];
            const bonusCard = await BonusCard.findById(cardId);
            if(bonusCard){
                const adjustment = (bonusCard.balance - payment.bonusDeduction) + (service.price - payment.bonusDeduction) * bonusPercentage; 
                await BonusCard.findByIdAndUpdate(cardId, 
                    { $inc: { balance: adjustment } }, 
                    { session }
                );       
            }
        }
        // 

        const response = {
            success: true, 
            medRecord: medRecord, 
            service: service, 
            msg: "Med record has been completed"
        };

        await session.commitTransaction(); 
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

export default completeRecord; 