import { StatusCodes } from "http-status-codes";
import MedPackage from "../../../db/models/MedPackage.js";
import { NotFound } from "../../../customErrors/Errors.js";
import Patient from "../../../db/models/Patient.js";
const deletePackage = async(req, res, next) => {
    try{
        const { id } = req.params; 
        const removedPackage = await MedPackage.findByIdAndDelete(id); 
        if(!removedPackage) throw new NotFound("Package to delete wasn't found");
        // if package is deleted, remove it from static patients' docs

        const patients = await Patient.updateMany({ packages: [id] }, { $pull: { packages: id } });
        const response = {
            success: true,
            removedPackage
        }
        return res.status(StatusCodes.OK).json(response);
    }catch(err){
        return next(err); 
    }
}

export default deletePackage; 