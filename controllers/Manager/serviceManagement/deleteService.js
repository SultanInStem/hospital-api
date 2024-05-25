import { StatusCodes } from "http-status-codes";
import Service from "../../../db/models/Service.js";
import { NotFound } from "../../../customErrors/Errors.js";
import PatientMedicalRecords from "../../../db/models/PatientMedicalRecords.js"; 
const deleteService = async(req, res, next) => {
    try{
        const { id } = req.params; 
        const service = await Service.findOneAndDelete({_id: id}); 
        if(!service) throw new NotFound("Service not found");

        // if deleted service has a queue of patients -> redirect them for the refund
        const queue = service.currentQueue; 
        for(let i = 0; i < queue.length; i++){
            const recordId = queue[i]; 
            await PatientMedicalRecords.findByIdAndUpdate(recordId, { $set: { status: "toRefund" } });
        }
        //--- 

        return res.status(StatusCodes.OK).json({success: true, service, msg: "service has been deleted successfuly"})
    }catch(err){
        return next(err);
    }
}
export default deleteService;