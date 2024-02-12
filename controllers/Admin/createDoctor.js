import { StatusCodes } from 'http-status-codes';
import Doctor from '../../db/models/Doctor.js'; 
import Admin from '../../db/models/Admin.js'; 
import { Unauthorized, BadRequest } from "../../customErrors/Errors.js";
import joi from "joi"; 
const specialties = process.env.DOC_SPECIALTIES.split(',').map(item => item.trim());


const validateData = (body) => {
    try{
        const valSchema = joi.object({
            username: joi.string().required().min(5),
            password: joi.string().required().min(6), 
            firstName: joi.string().required().min(2),
            lastName: joi.string().required().min(2),
            specialty: joi.string().required().valid(...specialties)
        })
        const {error, value} = valSchema.validate(body);
        if(error) throw error; 
        return value; 
    }catch(err){
        throw err; 
    }
}

const createDoctor = async(req, res, next) => {
    try{
        const adminId = req.userId; 
        const admin = await Admin.findOne({_id: adminId}); 
        if(!admin || !adminId) throw new Unauthorized("Unauthorized"); 
        const data = validateData(req.body);
        data.password = (data?.password).trim(); 
        const doctor = await Doctor.create(data); 
        if(!doctor) throw new BadRequest("something went wrong...");
        return res.status(StatusCodes.CREATED).json({success: true, doctor})
    }catch(err){
        return next(err); 
    }
}

export default createDoctor; 