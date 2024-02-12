import Doctor from '../../db/models/Doctor.js'; 
import { StatusCodes } from 'http-status-codes';
import { NotFound, BadRequest } from '../../customErrors/Errors.js';

const deleteDoctor = async (req, res, next) => {
    try{
        const { id } = req.params; 
        if(!id) throw new BadRequest("No ID provided"); 
        const doctor = await Doctor.findOneAndDelete({_id: id});
        if(!doctor) throw new NotFound("Doctor with this ID does not exist");
        return res.status(StatusCodes.OK).json({success: true, msg: "Doctor has been deleted", doctor}); 
    }catch(err){
        return next(err); 
    }
}

export default deleteDoctor;