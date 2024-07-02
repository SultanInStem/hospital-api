import Patient from "../../../db/models/Patient.js";
import { StatusCodes } from "http-status-codes";
import joi from "joi";
import validateData from "../../../utils/validateData.js";
import { mongoIdLength } from "../../../utils/constants.js";

const joiSchema = joi.object({
    patientId: joi.string().min(mongoIdLength).required(), 
    statusLocalis: joi.string().max(200).required()
});

const updateStatusLocalis = async(req, res, next) => {
    try{
        const {patientId, statusLocalis} = await validateData(joiSchema, req.body);
        await Patient.findByIdAndUpdate(patientId, { $set: { statusLocalis: statusLocalis } }, { projection: { statusLocalis: 1 } }); 
        return res.status(StatusCodes.OK).json({success: true}); 
    }catch(err){
        return next(err); 
    }
}
export default updateStatusLocalis; 