import { StatusCodes } from "http-status-codes";
import PatientMedicalRecord from "../../../db/models/PatientMedicalRecords.js";
import joi from "joi"; 
import validateData from "../../../utils/validateData.js";
import Payment from "../../../db/models/Payments.js";
import getInterval from "../../../utils/getUnixTodayInterval.js";

const joiSchema = joi.object({
    size: joi.string().regex(/^\d+$/),
    sortOrder: joi.string().valid('1','-1').regex(/^\d+$/),
    sortBy: joi.string().valid('date','price'),
    status: joi.string().valid('completed', 'toRefund', 'refunded', 'queue'),
    skip: joi.string().regex(/^\d+$/),
    isAdmin: joi.boolean().optional()
});

const getMedicalRecords = async(req, res, next) => {
    try{
        const query = await validateData(joiSchema, req.query); 
        const querySize = Number(query['size']) > 0 ? Number(query['size']) : 10; 
        const sortBy = (query['sortBy'] == 'date' ? 'createdAt' : 'totalPrice'); 
        const skip = Number(query['skip']) > 0 ? Number(query['skip']) : 0; 
        const sortOrder = Number(query['sortOrder']) ? Number(query['sortOrder']): -1; 
        const filter = {}; 
        let projection;

        if(query['status']){
            filter['status'] = query['status']
        }

        if(query['isAdmin']){
            projection = {mainDiagnosis: 0}
            // add filter to have records for today only
            const today = getInterval();
            filter['createdAt'] = {
                $gte: today.start,
                $lte: today.end
            }
        }

        const medicalRecords = await PatientMedicalRecord.find(filter, projection)
        .skip(skip) 
        .limit(querySize)
        .sort({[sortBy]: sortOrder}); 
         
        for(let i = 0; i < medicalRecords.length; i++){
            medicalRecords[i] = medicalRecords[i].toObject(); 
            if(!medicalRecords[i].isInpatient){
                const paymentId = medicalRecords[i].paymentRecord; 
                const paymentRecord = await Payment.findById(paymentId); 
                medicalRecords[i]['price'] = paymentRecord.amountFinal; 
            }
        }
        return res.status(StatusCodes.OK).json({success: true, medicalRecords, count: medicalRecords.length})
    }catch(err){
        return next(err); 
    }
}

export default getMedicalRecords; 