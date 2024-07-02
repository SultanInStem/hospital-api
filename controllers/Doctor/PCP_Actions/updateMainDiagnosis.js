import { StatusCodes } from "http-status-codes";
import Patient from "../../../db/models/Patient.js";
import joi from "joi"; 
import validateData from "../../../utils/validateData.js";
import { mongoIdLength } from "../../../utils/constants.js";
import NotFound from "../../../errorHandlers/NotFound.js";
import { Unauthorized } from "../../../customErrors/Errors.js";
const joiSchema = joi.object({
    diagnosis: joi.string().max(200).required(),
    patientId: joi.string().min(mongoIdLength).required() 
});

const updateMainDiagnosis = async (req, res, next) => {
    try{
        const { patientId, diagnosis } = await validateData(joiSchema, req.body); 
        await Patient.findByIdAndUpdate(patientId, {$set: { mainDiagnosis: diagnosis }});
        return res.status(StatusCodes.OK).json({success: true, newDiagnosis: diagnosis}); 
    }catch(err){
        return next(err); 
    }
}

export default updateMainDiagnosis;