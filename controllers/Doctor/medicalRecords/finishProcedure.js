import { StatusCodes } from "http-status-codes";
import joi from "joi"; 

const joiSchema = joi.object({
    procedureId: joi.string().required().min(24),
    medicalRecordId: joi.string().required().min(24)
})

const finishProcedure = async (req, res, next) => {
    try{
        const docId = req.userId; 
        return res.status(StatusCodes.OK).json({ success: true });
    }catch(err){
        return next(err); 
    }
}