import PatientMedicalRecord from "../../../db/models/PatientMedicalRecords.js";
import { StatusCodes } from "http-status-codes";
import Service from "../../../db/models/Service.js";
import { NotFound } from "../../../customErrors/Errors.js";

const completeRecord = async(req, res, next) => {
    try{
        const { id } = req.params; 
        const updatedRecord = await PatientMedicalRecord.findByIdAndUpdate(id, 
            { $set: { status: 'completed' } },
            { new: true }
        );
        if(!updatedRecord) throw new NotFound("Medical Record Not Found");
        // remove the record from the currentQueue of the service 

        const updatedService = await Service.findByIdAndUpdate(updatedRecord.serviceId, 
            {$pull: { currentQueue: id } },
            { new: true }
        );
        return res.status(StatusCodes.OK).json({
            success: true, 
            msg: 'Procedure has been finished', 
            medicalRecord: updatedRecord
        })
    }catch(err){
        return next(err); 
    }
}

export default completeRecord; 