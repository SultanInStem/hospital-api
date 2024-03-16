import { StatusCodes } from "http-status-codes";
import joi from "joi";
import { NotFound, BadRequest } from "../../customErrors/Errors.js"; 
import getAccessToken from "../../utils/getAccessToken.js"; 
import getRefreshToken from "../../utils/getRefreshToken.js"; 
import User from "../../db/models/User.js";
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
        const {username, password} = await validateData(req.body); 
        const user = await User.findOne({username});
        if(!user) throw new NotFound("User not found");
        const isPassMatch = await user.ValidatePassword(password); 
        if(!isPassMatch) throw new BadRequest("Invalid username or password"); 
        const accessToken = getAccessToken({userId: user._id, isAdmin: user.isAdmin });
        const refreshToken = getRefreshToken({userId: user._id, isAdmin: user.isAdmin });
        return res.status(StatusCodes.OK).json({success: true, msg: "Logged in", accessToken, refreshToken});
    }catch(err){
        return next(err); 
    }
}


export default login;