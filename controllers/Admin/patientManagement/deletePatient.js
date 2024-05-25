import { StatusCodes } from "http-status-codes";
import { BadRequest, NotFound } from "../../../customErrors/Errors.js";
import Patient from "../../../db/models/Patient.js";
import PatientMedicalRecord from "../../../db/models/PatientMedicalRecords.js";
const deletePatient = async(req, res, next) => {
    try{
        const { id } = req.params;
        // find pending medical records of that patient 
        const pendingRecords = await PatientMedicalRecord.find(
            {
                patientId: id, 
                $or:  [ {status: 'queue'}, {status: 'toRefund'} ]
            }
        );
        if(pendingRecords.length > 0) throw new BadRequest("Patient cannot be delete since they have pending records");
        const removedPatient = await Patient.findOneAndDelete({ _id: id });
        if(!removedPatient) throw new NotFound("Patient not found");
        return res.status(StatusCodes.OK).json({success: true, msg: "Patient has been deleted", removedPatient})
    }catch(err){
        return next(err); 
    }
}
export default deletePatient;