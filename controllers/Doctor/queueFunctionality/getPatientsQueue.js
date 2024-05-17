import joi from "joi"; 
import { StatusCodes } from "http-status-codes";
import Service from "../../../db/models/Service.js"; 
import PatientMedicalRecord from "../../../db/models/PatientMedicalRecords.js"; 
import _ from "lodash";

const getPatientsQueue = async(req, res, next) => {
    try{
        const doctorId = req.userId; 
        const services = await Service.find({ providedBy: doctorId, isAvailable: true });
        const netQueue = [];
        const patientRecordProjection = {
            updatedAt: 0,
            paymentRecord: 0,
        };
        for(let i = 0; i < services.length; i++){
            const queue = services[i].currentQueue; 
            if(queue.length < 1) continue; 
            const firstPatient = await PatientMedicalRecord.findById(queue[0],patientRecordProjection); 
            if(!firstPatient) continue;
            firstPatient['service'] = services[i].title; 
            queue[0] = firstPatient;
            netQueue.push({time: firstPatient.createdAt, queue, serviceTitle: services[i].title});
        }
        const sortedQueueIds = _.sortBy(netQueue,'time'); 
        const sortedPatients = []; 
        for(let i = 0; i < sortedQueueIds.length; i++){
            const queueIds = sortedQueueIds[i]['queue'];
            const serviceTitle = sortedQueueIds[i]['serviceTitle'];
            sortedPatients.push(queueIds[0]); 
            for(let j = 1; j < queueIds.length; j++){
                const patientRecord = await PatientMedicalRecord.findById(queueIds[j], patientRecordProjection); 
                patientRecord['service'] = serviceTitle;
                sortedPatients.push(patientRecord);
            }
        }
        return res.status(StatusCodes.OK).json({success: true, queue: sortedPatients}); 
    }catch(err){
        return next(err); 
    }
}

export default getPatientsQueue; 