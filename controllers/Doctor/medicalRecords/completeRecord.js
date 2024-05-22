import PatientMedicalRecord from "../../../db/models/PatientMedicalRecords.js";
import { StatusCodes } from "http-status-codes";
import Service from "../../../db/models/Service.js";
import { BadRequest, NotFound } from "../../../customErrors/Errors.js";

const completeRecord = async(req, res, next) => {
    try{
        const { id } = req.params; 
        const recordProj = {
            paymentRecord: 0, 
            patientFirstName: 0, 
            patientLastName: 0, 
            patientId: 0
        }
        const medRecord = await PatientMedicalRecord.findById(id,recordProj); 
        if(!medRecord) throw new NotFound("Medical Record Not Found");
        else if(medRecord.status !== 'queue') throw new BadRequest("This record cannot be completed");

        await PatientMedicalRecord.findByIdAndUpdate(id, 
            {$set: {status: "completed"}},
            {new: true}
        );

        // remove the record from the currentQueue of the service 
        const updatedService = await Service.findOneAndUpdate({_id: medRecord.serviceId}, 
            {$pull: { currentQueue: id } },
            { new: true }
        );
        return res.status(StatusCodes.OK).json({
            success: true, 
            msg: 'Procedure has been finished', 
            medicalRecord: updatedService
        })
    }catch(err){
        return next(err); 
    }
}

export default completeRecord; 