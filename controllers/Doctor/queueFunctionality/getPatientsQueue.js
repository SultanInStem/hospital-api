import { StatusCodes } from "http-status-codes";
import Service from "../../../db/models/Service.js"; 
import PatientMedicalRecord from "../../../db/models/PatientMedicalRecords.js"; 
import _ from "lodash";

const getPatientsQueue = async(req, res, next) => {
    try{
        const doctorId = req.userId; 
        const services = await Service.find({ providedBy: doctorId, isAvailable: true });
        const netQueue = [];
        for(let i = 0; i < services.length; i++){
            const queue = services[i].currentQueue; 
            if(queue.length < 1) continue; 
            for(let j = 0; j < queue.length; j++){
                const patientRecord = await PatientMedicalRecord.findById(queue[j], {paymentRecord: 0, updatedAt: 0, __v: 0});  
                if(!patientRecord) continue; 
                const recordObj = patientRecord.toObject(); 
                recordObj['serviceTitle'] = services[i].title; 
                netQueue.push(recordObj);   
            }
        }
        const sortedQueue = _.sortBy(netQueue, 'createdAt');
        return res.status(StatusCodes.OK).json({success: true, queue: sortedQueue}); 
    }catch(err){
        return next(err); 
    }
}

export default getPatientsQueue; 