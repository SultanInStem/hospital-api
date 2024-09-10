import { StatusCodes } from "http-status-codes";
import Service from "../../../db/models/Service.js"; 
import PatientMedicalRecord from "../../../db/models/PatientMedicalRecords.js"; 
import getInterval from "../../../utils/getUnixTodayInterval.js";
import _ from "lodash";

// const getPatientsQueue = async(req, res, next) => {
//     try{
//         const doctorId = req.userId; 
//         const services = await Service.find({ providedBy: doctorId, isAvailable: true });
//         const netQueue = [];

//         for(let i = 0; i < services.length; i++){
//             const queue = services[i].currentQueue; 
//             if(queue.length < 1) continue; 
//             for(let j = 0; j < queue.length; j++){
//                 const patientRecord = await PatientMedicalRecord.findById(queue[j], {paymentRecord: 0, updatedAt: 0, __v: 0});  
//                 if(!patientRecord) continue; 
//                 const recordObj = patientRecord.toObject(); 
//                 recordObj['serviceTitle'] = services[i].title; 
//                 netQueue.push(recordObj);   
//             }
//         }

//         const sortedQueue = _.sortBy(netQueue, 'createdAt');
//         return res.status(StatusCodes.OK).json({success: true, queue: sortedQueue}); 
//     }catch(err){
//         return next(err); 
//     }
// }

const getPatientsQueue = async (req, res, next) => {
    try{
        const doctorId = req.userId;

        // Fetch all services provided by the doctor
        const services = await Service.find({ providedBy: doctorId, isAvailable: true }).select('title currentQueue');

        // Collect all queue IDs into one array
        const allQueueIds = services.flatMap(service => service.currentQueue).filter(Boolean);
        if (allQueueIds.length === 0) {
            return res.status(StatusCodes.OK).json({ success: true, queue: [] });
        }

        // Fetch all patient records in a single query
        const filter = {_id: { $in: allQueueIds }}        
        //  for today only by default
        // NOTE: will be changed in the future
        const today = getInterval();
        filter['createdAt'] = {
            $gte: today.start,
            $lte: today.end
        }

        const patientRecords = await PatientMedicalRecord.find(
            filter,
            { paymentRecord: 0, updatedAt: 0, __v: 0, mainDiagnosis: 0 }
        );

        // Create a map of record IDs to their service titles
        const serviceTitleMap = services.reduce((map, service) => {
        service.currentQueue.forEach(queueId => {
            map[queueId] = service.title;
        });
        return map;
        }, {});

        // Attach service title to each patient record
        const netQueue = patientRecords.map(record => {
        const recordObj = record.toObject();
        recordObj['serviceTitle'] = serviceTitleMap[record._id.toString()];
        return recordObj;
        });

        // Sort the queue by createdAt
        const sortedQueue = _.sortBy(netQueue, 'createdAt');

        return res.status(StatusCodes.OK).json({ success: true, queue: sortedQueue });
    } catch (err) {
      return next(err);
    }
};


export default getPatientsQueue; 