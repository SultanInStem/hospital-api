import { StatusCodes } from "http-status-codes";
import User from "../../db/models/User.js";
import joi from "joi";
import { BadRequest, Unauthorized } from "../../customErrors/Errors.js"; 
const validateBody = (body) => {
    try{
        const schema = joi.object({
            username: joi.string().required(),
            password: joi.string().required(),
            key: joi.string().required()
        })
        const {error, value} = schema.validate(body); 
        if(error) throw error; 
        return value;
    }catch(err){
        throw err; 
    }
}
const createAdmin = async (req, res, next) => {
    try{
        const { username, password, key } = await validateBody(req.body); 
        if(key !== process.env.MONGO_ADMIN_KEY) throw new Unauthorized("Invalid key provided")
        const admin = await User.create({isAdmin: true, username, password}); 
        return res.status(StatusCodes.CREATED).json({success: true, msg: 'Admin has been created'});
    }catch(err){
        return next(err); 
    }
}
export default createAdmin;