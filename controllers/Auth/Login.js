import { StatusCodes } from "http-status-codes";
import joi from "joi";
import { NotFound, BadRequest } from "../../customErrors/Errors.js"; 
import getAccessToken from "../../utils/getAccessToken.js"; 
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
``
const login = async (req, res, next) => {
    try{

    }catch(err){
        return next(err); 
    }
}


export default login;