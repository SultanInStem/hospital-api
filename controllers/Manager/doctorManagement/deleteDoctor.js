import User from "../../../db/models/User.js";
import { StatusCodes } from "http-status-codes";
import { NotFound } from "../../../customErrors/Errors.js";
import Service from "../../../db/models/Service.js"; 
import Patient from "../../../db/models/Patient.js";
import PatientMedicalRecord from "../../../db/models/PatientMedicalRecords.js";
const deleteDoctor = async (req, res, next) => {
    try{
        const { id } = req.params;
        const deletedDoctor = await User.findOneAndDelete({role: 'Doctor', _id: id}); 
        if(!deletedDoctor) throw new NotFound("Doctor not found"); 
        // if doctor is deleted, remove the services associated with them 
        const servicesToDelete = await Service.find({providedBy: id}); 
        if(servicesToDelete.length > 0){
            const deletedServicesRes = await Service.deleteMany({providedBy: id}); 
            console.log(deletedServicesRes); 
        }
        // if service has a currentQueue, redirect patients for the refund 
        for(let i = 0; i < servicesToDelete.length; i++){
            const service = servicesToDelete[i]; 
            if(service.currentQueue.length > 0){
                for(let j = 0; j < service.currentQueue.length; j++){
                    const recordId = service.currentQueue[j]; 
                    await PatientMedicalRecord.findByIdAndUpdate(recordId, { $set: { status: 'toRefund' } }); 
                }
            }
        }
        // if the doctor was PCP for some patients, delete doc ID from those patients 
        await Patient.updateMany({PCP: id}, {$set: { PCP: null }}); 
        const response = {
            success: true, 
            msg: "Doctor has been deleted successfuly",
            deletedDoctor: deletedDoctor
        }
        return res.status(StatusCodes.OK).json(response);
    }catch(err){
        return next(err); 
    }
}

export default deleteDoctor;