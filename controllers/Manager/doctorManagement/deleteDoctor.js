import User from "../../../db/models/User.js";
import { StatusCodes } from "http-status-codes";
import { NotFound } from "../../../customErrors/Errors.js";
const deleteDoctor = async (req, res, next) => {
    try{
        const { id } = req.params;
        const deletedDoctor = await User.findOneAndDelete({role: 'Doctor', _id: id}); 
        if(!deletedDoctor) throw new NotFound("Doctor not found");
        return res.status(StatusCodes.OK).json({success: true, deletedDoctor, msg: "Doctor has been deleted successfuly"});
    }catch(err){
        return next(err); 
    }
}

export default deleteDoctor;