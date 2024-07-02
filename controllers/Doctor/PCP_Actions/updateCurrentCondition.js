import Patient from "../../../db/models/Patient.js";
import { StatusCodes } from "http-status-codes";
import joi from "joi"; 
import validateData from "../../../utils/validateData.js";
import { mongoIdLength } from "../../../utils/constants.js";
import { NotFound, Unauthorized } from "../../../customErrors/Errors.js";
const joiSchema = joi.object({
    patientId: joi.string().min(mongoIdLength).required(), 
    currentCondition: joi.string().max(200).required()
})


const updateCurrentCondition = async (req, res, next) => {
    try{
        const docId = req.userId; 
        const {patientId, currentCondition} = await validateData(joiSchema, req.body); 
        const patient = await Patient.findById(patientId, {PCP: 1});
        if(!patient) throw new NotFound(`Patient with ID ${patientId} not found`);
        else if(patient.PCP != docId) throw new Unauthorized("You are not allowed to update this field"); 
        await Patient.findByIdAndUpdate(patientId, { $set: { currentCondition: currentCondition } }, {projection: {currentCondition: 1}});
        return res.status(StatusCodes.OK).json({success: true, newCurrentCondition: currentCondition}); 
    }catch(err){
        return next(err); 
    }
}
export default updateCurrentCondition; 