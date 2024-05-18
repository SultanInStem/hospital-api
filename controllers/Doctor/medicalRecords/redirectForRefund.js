import { StatusCodes } from "http-status-codes";
import PatientMedicalRecord from "../../../db/models/PatientMedicalRecords.js";
import { BadRequest, NotFound } from "../../../customErrors/Errors.js";
import Service from "../../../db/models/Service.js";

const redirectForRefund = async (req,res, next) => {
    try{
        const { id } = req.params; 
        const recordProj = {
            patientFirstName: 0, 
            patientId: 0,
            patientLastName: 0, 
            paymentRecord: 0,
            createdAt: 0
        };
        const medRecord = await PatientMedicalRecord.findById(id, recordProj); 
        
        if(!medRecord) throw new NotFound("Medical Record not found"); 
        else if(medRecord.status === 'completed') throw new BadRequest("This record has already been completed");
        else if(medRecord.status === 'refunded') throw new BadRequest("The refund has already been made"); 
        else if(medRecord.status === 'toRefund') throw new BadRequest("This record is waiting for the refund");

        const updatedRecord = await PatientMedicalRecord.findByIdAndUpdate(id, 
            {
                $set: { status: "toRefund"}
            },
            {
                new: true,
                projection: recordProj
            }
        ); 
        if(!updatedRecord) throw new NotFound("Medical Record not found"); 


        const updatedService = await Service.findByIdAndUpdate(updatedRecord.serviceId, 
            {
                $pull: { currentQueue: id } 
            }, 
            {
                new: true,
                projection: {
                    price: 0, 
                    providedBy: 0
                }
            }
        );
        return res.status(StatusCodes.OK).json(
            { 
                success: true, 
                msg: "Patient has been redirected for the refund", 
                medicalRecord: updatedRecord
            }
        );
    }catch(err){
        return next(err); 
    }
}
export default redirectForRefund;