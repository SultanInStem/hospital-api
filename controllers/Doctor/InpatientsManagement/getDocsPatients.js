import { StatusCodes } from "http-status-codes";
import Patient from "../../../db/models/Patient.js"; 

const getDoctorsPatients = async (req, res, next) => {
    try{
        const docId = req.userId; 
        const patients = await Patient.find({PCP: docId}); 
        return res.status(StatusCodes.OK).json({success: true, patients}); 
    }catch(err){
        return next(err); 
    }
}
export default getDoctorsPatients; 