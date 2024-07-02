import Patient from "../../../db/models/Patient.js";
import { StatusCodes } from "http-status-codes";
import joi from "joi"; 
import validateData from "../../../utils/validateData.js";
import { mongoIdLength } from "../../../utils/constants.js";
const joiSchema = joi.object({
    patientId: joi.string().min(mongoIdLength).required(), 
    neuroCondition: joi.string().max(200).required()
}); 

const updateNeuroCondition = async (req, res, next) => {
    try{
        const {patientId, neuroCondition} = await validateData(joiSchema, req.body);
        await Patient.findByIdAndUpdate(patientId, { $set: { neuroCondition: neuroCondition } }, { projection: {neuroCondition: 1} }); 
        return res.status(StatusCodes.OK).json({success: true, newNeuroCondition: neuroCondition}); 
    }catch(err){
        return next(err); 
    }
}

export default updateNeuroCondition; 