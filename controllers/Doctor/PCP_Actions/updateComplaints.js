import Patient from "../../../db/models/Patient.js";
import { StatusCodes } from "http-status-codes";
import joi from "joi"; 
import validateData from "../../../utils/validateData.js";
import { mongoIdLength } from "../../../utils/constants.js";


const joiSchema = joi.object({
    complaints: joi.string().max(200).required(), 
    patientId: joi.string().min(mongoIdLength).required()
})

const updateComplaints = async (req, res, next) => {
    try{
        const { patientId, complaints } = await validateData(joiSchema, req.body); 
        await Patient.findByIdAndUpdate(patientId, { $set: { complaints: complaints } }, { projection: { complaints: 1 }});
        return res.status(StatusCodes.OK).json({success: true, newComplaints: complaints});
    }catch(err){
        return next(err); 
    }
}
export default updateComplaints;
