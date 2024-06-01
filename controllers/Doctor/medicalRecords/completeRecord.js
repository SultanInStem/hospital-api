import PatientMedicalRecord from "../../../db/models/PatientMedicalRecords.js";
import { StatusCodes } from "http-status-codes";
import Service from "../../../db/models/Service.js";
import { BadRequest, NotFound } from "../../../customErrors/Errors.js";
import mongoose, { mongo } from "mongoose";
const completeRecord = async(req, res, next) => {
    const session = await mongoose.startSession(); 
    session.startTransaction(); 
    let isTransactionFailed = false; 
    try{
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
        const updatedService = await Service.findOneAndUpdate({_id: medRecord.serviceId}, 
            { $pull: { currentQueue: id } },
            { new: true }
        );

        const response = {
            success: true, 
            medRecord: medRecord, 
            service: updatedService, 
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