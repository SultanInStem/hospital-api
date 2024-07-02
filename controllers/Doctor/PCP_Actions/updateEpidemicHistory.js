import Patient from "../../../db/models/Patient.js";
import joi from "joi"; 
import validateData from "../../../utils/validateData.js";
import { StatusCodes } from "http-status-codes";
import { mongoIdLength } from "../../../utils/constants.js";
import NotFound from "../../../errorHandlers/NotFound.js";
import { Unauthorized } from "../../../customErrors/Errors.js";
const joiSchema = joi.object({
    epidemicHistory: joi.string().max(200).required(), 
    patientId: joi.string().min(mongoIdLength).required()
});

const updateEpidemicHistory = async(req, res, next) => {
    try{
        const {patientId, epidemicHistory} = await validateData(joiSchema, req.body);
        await Patient.findByIdAndUpdate(patientId, {$set: { epidemicHistory: epidemicHistory }});
        return res.status(StatusCodes.OK).json({success: true, newEpidemicHistory: epidemicHistory}); 
    }catch(err){
        return next(err); 
    }
}

export default updateEpidemicHistory; 