import mongoose from "mongoose"; 
import BonusCard from "../../../db/models/BonusCard.js";
import { StatusCodes } from "http-status-codes";
import PatientMedicalRecord from "../../../db/models/PatientMedicalRecords.js";
import { NotFound, BadRequest } from "../../../customErrors/Errors.js";
import Payment from "../../../db/models/Payments.js";

const makeRefund = async(req, res, next) => {
    const session = await mongoose.startSession(); 
    session.startTransaction(); 
    let isTransactionFailed = false; 
    try{
        const medRecordId = req.params.id;
        const medRecord = await PatientMedicalRecord.findByIdAndUpdate(medRecordId, 
            { $set: { status: "refunded" } },
            { new: false, session }
        ); 
        // if status of the medRecord wasn't toRefund, throw an error 
        if(!medRecord) throw new NotFound(`Med Record with ID ${medRecordId} not found`);
        else if(medRecord.status !== 'toRefund' && medRecord.status !== 'queue') throw new BadRequest("Record is not eligible for refund");
        else if(medRecord.isInpatient) throw new BadRequest("Inapatients are not elligible for the refund");

        // find payment record 
        const paymentId = medRecord.paymentRecord; 
        const payment = await Payment.findByIdAndUpdate(paymentId, 
            { $set: { isRefunded: true } },
            { new: false, session }
        );

        // // if payment was made with BonusCard, deposit the refund onto the BonusCard
        if(payment['bonusCardId']){
            const cardId = payment['bonusCardId']; 
            const refundedBonus = payment.bonusDeduction; 
            if(refundedBonus > 0){
                const updatedBonus = await BonusCard.findByIdAndUpdate({cardId: cardId}, 
                    { $inc: { balance: refundedBonus } }, 
                    { session }
                ); 
                if(!updatedBonus) throw new NotFound("Invalid BonusCard ID"); // if bonus card DNE refund can't be made???
            }
        }

        await session.commitTransaction(); 
        return res.status(StatusCodes.OK).json({success: true, msg: "Refund has been made"}); 
    }catch(err){
        return next(err);
    }finally{
        if(isTransactionFailed){
            session.abortTransaction(); 
        }
        await session.endSession();
    }
}
export default makeRefund; 