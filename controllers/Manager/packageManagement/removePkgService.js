import joi from "joi";
import { StatusCodes } from "http-status-codes";
import MedPackage from "../../../db/models/MedPackage.js";
import validateData from "../../../utils/validateData.js";
import { NotFound } from "../../../customErrors/Errors.js";
const ID_LENGTH = Number(process.env.MONGO_MIN_ID_LENGTH); 
const joiSchema = joi.object({
    packageId: joi.string().min(ID_LENGTH).required(),
    serviceId: joi.string().min(ID_LENGTH).required()
})

const removePkgService = async(req, res, next) =>{
    try{
        const { serviceId, packageId } = await validateData(joiSchema, req.body); 
        const updatedPackage = await MedPackage.findByIdAndUpdate(packageId, 
            { $pull: { servicesAllowed: serviceId } }
        ); 
        if(!updatedPackage) throw new NotFound(`Package with ID ${packageId} not found`); 
        return res.status(StatusCodes.OK).json(
            {
                success: true,
                msg: 'package has been updated', 
                updatedPackage
            }
        );
    }catch(err){
        return next(err);
    }
}

export default removePkgService; 