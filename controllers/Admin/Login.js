const { StatusCodes } = require('http-status-codes');
const Admin = require('../../db/models/Admin'); 
const joi = require('joi'); 
const { NotFound } = require('../../customErrors/Errors'); 
const getAccessToken = require('../../utils/getAccessToken'); 
const getRefreshToken = require("../../utils/getRefreshToken"); 
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
        
        return res.status(StatusCodes.OK).json({success: true})
    }catch(err){
        return next(err); 
    }
}
module.exports = login; 