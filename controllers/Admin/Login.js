import { StatusCodes } from 'http-status-codes';
import Admin from '../../db/models/Admin.js'; 
import joi from 'joi'; 
import { NotFound, BadRequest } from '../../customErrors/Errors.js'; 
import getAccessToken from '../../utils/getAccessToken.js'; 
import getRefreshToken from "../../utils/getRefreshToken.js"; 
const validateData = async (data) => {
    try{
        const schema = joi.object({
            username: joi.string().required(),
            password: joi.string().required()
        })
        const {error,value} = schema.validate(data); 
        if(error) throw error; 
        return value; 
    }catch(err){
        throw err; 
    }
}
const login = async (req, res, next) => {
    try{
        const data = req.body; 
        const validated = await validateData(data);
        
        const {username, password} = validated; 
        const admin = await Admin.findOne({username});
        if(!admin) throw new NotFound("Admin cannot be found"); 
        const isPasswordValid = await admin.ValidatePassword(password);  
        if(!isPasswordValid) throw new BadRequest("Incorrect password or username"); 

        const accessToken = getAccessToken({userId: admin._id});
        const refreshToken = getRefreshToken({userId: admin._id});

        return res.status(StatusCodes.OK).json({success: true, accessToken, refreshToken});
    }catch(err){
        return next(err); 
    }
}
export default login; 