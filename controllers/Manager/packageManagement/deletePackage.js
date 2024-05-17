import { StatusCodes } from "http-status-codes";
import MedPackage from "../../../db/models/MedPackage.js";
import { NotFound } from "../../../customErrors/Errors.js";

const deletePackage = async(req, res, next) => {
    try{
        const { id } = req.params; 
        const removedPackage = await MedPackage.findByIdAndDelete(id); 
        if(!removedPackage) throw new NotFound("Package to delete wasn't found");
        return res.status(StatusCodes.OK).json({success: true})
    }catch(err){
        return next(err); 
    }
}

export default deletePackage; 