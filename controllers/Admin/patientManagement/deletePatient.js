import { StatusCodes } from "http-status-codes";
import { NotFound } from "../../../customErrors/Errors.js";
import Patient from "../../../db/models/Patient.js";

const deletePatient = async(req, res, next) => {
    try{
        const {id} = req.params;
        const removedPatient = await Patient.findOneAndDelete({_id: id})
        if(!removedPatient) throw new NotFound("Patient not found")
        return res.status(StatusCodes.OK).json({success: true, msg: "Patient has been deleted", removedPatient})
    }catch(err){
        return next(err); 
    }
}
export default deletePatient;