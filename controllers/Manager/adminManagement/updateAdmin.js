import User from "../../../db/models/User.js"; 
import { StatusCodes } from "http-status-codes";
import joi from "joi"; 
import validateData from "../../../utils/validateData.js"; 
import { BadRequest, NotFound } from "../../../customErrors/Errors.js";
import { mongoIdLength, phonePattern } from "../../../utils/constants.js"; 

const joiSchema = joi.object({
    firstName: joi.string().optional(),
    lastName: joi.string().optional(),
    phoneNumber: joi.string().pattern(phonePattern).optional(),
    username: joi.string().optional(), 
    adminId: joi.string().min(mongoIdLength).required()
});

const updateAdmin = async (req, res, next) => {
    try{
        const data = await validateData(joiSchema, req.body); 
        if(data['username']){
            const isTaken = await User.findOne({username: data['username']}); 
            if(isTaken) throw new BadRequest(`Username ${data['username']} is already taken`); 
        }
        const adminId = data['adminId'];
        delete data['adminId']; 
        const updatedAdmin = await User.findOneAndUpdate(
            {_id: adminId, role: 'Admin'},
            data
        );
        if(!updatedAdmin) throw new NotFound(`Admin with ID ${adminId} not found`);
        const response = {
            success: true, 
            msg: 'Admin has been updated', 
            updatedAdmin
        }
        return res.status(StatusCodes.OK).json(response); 
    }catch(err){
        return next(err); 
    }
}
export default updateAdmin; 