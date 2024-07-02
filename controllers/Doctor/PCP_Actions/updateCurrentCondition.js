import Patient from "../../../db/models/Patient.js";
import { StatusCodes } from "http-status-codes";
import joi from "joi"; 
import validateData from "../../../utils/validateData.js";
import { mongoIdLength } from "../../../utils/constants.js";
const joiSchema = joi.object({
    patientId: joi.string().min(mongoIdLength).required(), 
    currentCondition: joi.string().max(200).required()
})

const updateCurrentCondition = async (req, res, next) => {
    try{
        const {patientId, currentCondition} = await validateData(joiSchema, req.body); 
        await Patient.findByIdAndUpdate(patientId, { $set: { currentCondition: currentCondition } }, {projection: {currentCondition: 1}});
        return res.status(StatusCodes.OK).json({success: true, newCurrentCondition: currentCondition}); 
    }catch(err){
        return next(err); 
    }
}
export default updateCurrentCondition; 