import { StatusCodes } from 'http-status-codes';
// import Doctor from '../../db/models/Doctor.js'; 
import { NotFound, BadRequest } from '../../customErrors/Errors.js'; 
import getAccessToken from '../../utils/getAccessToken.js'; 
import getRefreshToken from '../../utils/getRefreshToken.js'; 
import joi from "joi"; 

const validateData = (data) => {
    try{
        const schema = joi.object({
            username: joi.string().required().min(4),
            password: joi.string().required().min(5)
        })
        const {error, value} = schema.validate(data); 
        if(error) throw error; 
        return value; 
    }catch(err){
        throw err; 
    }
}

const login = async (req, res, next) => { 
    try{
        const {username, password} = await validateData(req.body);
        const doctor = await Doctor.findOne({username: username}); 
        if(!doctor) throw new NotFound("Doctor cannot be found");
        const isMatch = await doctor.ValidatePassword(password); 
        if(!isMatch) throw new BadRequest("Incorrect password"); 
        const accessToken = getAccessToken({userId: doctor._id}); 
        const refreshToken = getRefreshToken({userID: doctor._id}); 
        return res.status(StatusCodes.OK).json({success: true, accessToken, refreshToken})
    }catch(err){
        return next(err); 
    }
}

export default login;