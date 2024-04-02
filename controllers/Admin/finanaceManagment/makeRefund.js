import joi from "joi"; 
import mongoose from "mongoose"; 
import { StatusCodes } from "http-status-codes";
import validateData from "../../../utils/validateData.js"; 
import PatientMedicalRecord from "../../../db/models/PatientMedicalRecords.js";
import { NotFound, BadRequest } from "../../../customErrors/Errors.js";
import Payment from "../../../db/models/Payments.js";
const joiSchema = joi.object({
    medicalRecordId: joi.string().required().min(22),
    procedureIds: joi.array().items(joi.string()).min(1).required()
});
 
const makeRefund = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    let isTransactionFailed = false;
    try{
        const { medicalRecordId, procedureIds } = await validateData(joiSchema, req.body); 
        const medRecordProjection = {
            allDoctorsInvolved: 0, 
            awaitingProcedures: 0, 
            finishedProcedures: 0, 
            patientLastName: 0, 
            patientFirstName: 0, 
            patientId: 0
        }
        const medRecord = await PatientMedicalRecord.findOne(
            { _id: medicalRecordId }, 
            medRecordProjection
        ); 
        if(!medRecord) throw new NotFound("Medical record with that ID not found");
        else if(medRecord.status === 'completed') throw new BadRequest("Medical record is complete, unable to make a refund");

        
        // check if paymentSlip is linked to the med-record
        const paymentSlip = await Payment.findOne({_id: medRecord.paymentSlip}, {refundHistory: 0}); 
        if(!paymentSlip) throw new NotFound("Unable to find a payment slip for this medical record");
        // check if rejectedProcedures contain the procedures claimed for the refund

        const rejectedProcedures = medRecord.rejectedProcedures; 
        const paidProcedures = paymentSlip.paidServices; 
        const refundProcedures = []; 
        let deductedAmount = 0;

        for(let i = 0; i < procedureIds.length; i++){
            const procedureId = procedureIds[i]; 
            let isFound = false; 
            for(let j = 0; j < rejectedProcedures.length; j++){
                if(rejectedProcedures[j] == procedureId){
                    const procedure = paidProcedures.get(procedureId);
                    if(!procedure) throw new NotFound(`Procedure ID ${procedureId} has not been found in the paymentslip`); 
                    refundProcedures.push(procedureId);
                    deductedAmount += procedure.price; 
                    isFound = true; 
                    break; 
                }
            }
            if(!isFound){
                throw new NotFound("Procedure with ID " + procedureId + " is not found as a rejected procedure");
            }
        } 

        if(rejectedProcedures.length === refundProcedures.length){
            // we refunded money for all rejected procedures so the med-record status is completed 
            await PatientMedicalRecord.findByIdAndUpdate(medicalRecordId, 
                {
                    $set: { rejectedProcedures: [], status: 'completed' }
                },
                { 
                    session, 
                    projection: medRecordProjection
                }
            );
        }else if(rejectedProcedures.length > refundProcedures.length){
            // refund money for SOME of the rejected procedures 
            await PatientMedicalRecord.findByIdAndUpdate(medicalRecordId, 
                {
                    $pull: { rejectedProcedures: { $in: refundProcedures} }
                },
                {
                    session,
                    projection: medRecordProjection
                }
            );

        }else{
            throw new BadRequest("Cannot refund money for more procedures than have been rejected");
        }
        const refundHistoryObj = {
            previousAmount: paymentSlip.netAmount, 
            deductedAmount,
            finalAmount: paymentSlip.netAmount - deductedAmount,
            refundedServices: refundProcedures,
            updatedAt: new Date()
        }; 

        const updatedPaymentSlip = await Payment.findByIdAndUpdate(medRecord.paymentSlip, 
            { 
                $set: { netAmount: refundHistoryObj['finalAmount'] },
                $push: { refundHistory: refundHistoryObj } 
            },
            {new: true, session}
        );
        if(!updatedPaymentSlip) throw new BadRequest("Failed to make a refund");

        await session.commitTransaction(); 
        return res.status(StatusCodes.OK).json({success: true, updatedPaymentSlip}); 
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
export default makeRefund; 