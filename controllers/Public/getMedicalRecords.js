import { StatusCodes } from "http-status-codes";
import PatientMedicalRecord from "../../db/models/PatientMedicalRecords.js";
import joi from "joi"; 
import validateData from "../../utils/validateData.js";

const joiSchema = joi.object({
    size: joi.string().regex(/^\d+$/),
    sortOrder: joi.string().valid('1','-1').regex(/^\d+$/),
    sortBy: joi.string().valid('date','price'),
    status: joi.string().valid('completed', 'toRefund', 'refunded', 'queue'),
    skip: joi.string().regex(/^\d+$/)
})
const getMedicalRecords = async(req, res, next) => {
    try{
        const query = await validateData(joiSchema, req.query); 
        const querySize = Number(query['size']) > 0 ? Number(query['size']) : 10; 
        const sortBy = (query['sortBy'] == 'date' ? 'createdAt' : 'totalPrice'); 
        const skip = Number(query['skip']) > 0 ? Number(query['skip']) : 0; 
        const sortOrder = Number(query['sortOrder']) ? Number(query['sortOrder']): -1; 
        const filter = {}; 
        if(query['status']){
            filter['status'] = query['status']
        }
        const medicalRecords = await PatientMedicalRecord.find(filter)
        .skip(skip) 
        .limit(querySize)
        .sort({[sortBy]: sortOrder}); 
        return res.status(StatusCodes.OK).json({success: true, medicalRecords, count: medicalRecords.length})
    }catch(err){
        return next(err); 
    }
}

export default getMedicalRecords; 