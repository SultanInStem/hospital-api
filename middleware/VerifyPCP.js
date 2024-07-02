import ErrorHandler from "../errorHandlers/ErrorHandler.js"; 
import Patient from "../db/models/Patient.js";
import { BadRequest, Unauthorized } from "../customErrors/Errors";
import NotFound from "../errorHandlers/NotFound";

const VerifyPCP = async (req, res, next) => {
    try{
        const { patientId } = req.body;
        if(!patientId) throw new BadRequest("Please provide patient ID");
        const patient = await Patient.findById(patientId, {PCP: 1}); 
        if(!patient) throw new NotFound(`Patient with ID ${patientId} not found`); 
        else if(patient.PCP != req.userId) throw new Unauthorized("You are not allowed to make this request"); 
        next();
    }catch(err){
        ErrorHandler(err, req, res);
    }
}
export default VerifyPCP;