import joi from "joi"; 
import { StatusCodes } from "http-status-codes";
import validateData from "../../../utils/validateData.js"; 
import PatientMedicalRecord from "../../../db/models/PatientMedicalRecords.js";
import Payment from "../../../db/models/Payments.js";
const joiSchema = joi.object({

});

const makeRefund = async (req, res, next) => {
    try{

        return res.status(StatusCodes.OK).json({success: true}); 
    }catch(err){
        return next(err);
    }
}
export default makeRefund; 