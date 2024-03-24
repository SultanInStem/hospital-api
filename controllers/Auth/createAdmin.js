import { StatusCodes } from "http-status-codes";
import User from "../../db/models/User.js";
import joi from "joi";
import { Unauthorized } from "../../customErrors/Errors.js"; 
import validateData from "../../utils/validateData.js";
const schema = joi.object({
    username: joi.string().required(),
    password: joi.string().required(),
    role: joi.string().valid('Admin').required(),
    key: joi.string().required()
})

const createAdmin = async (req, res, next) => {
    try{
        const { username, password, key, role } = await validateData(schema, req.body); 
        if(key !== process.env.MONGO_ADMIN_KEY) throw new Unauthorized("Invalid key provided")
        const admin = await User.create({isAdmin: true, username, password, role}); 
        return res.status(StatusCodes.CREATED).json({success: true, msg: 'Admin has been created'});
    }catch(err){
        return next(err); 
    }
}
export default createAdmin;