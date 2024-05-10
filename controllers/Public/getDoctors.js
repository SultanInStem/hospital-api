import joi from "joi";
import validateData from "../../utils/validateData.js";
import { StatusCodes } from "http-status-codes";
import User from "../../db/models/User.js";
const querySchema = joi.object({
    firstName: joi.string().optional(),
    lastName: joi.string().optional(),
    username: joi.string().optional(),
    specialty: joi.string().optional(),
    size: joi.string().regex(/^\d+$/).optional(),
    skip: joi.string().regex(/^\d+$/).optional()
});
const getDoctors = async (req, res, next) => {
    try{
        const query = await validateData(querySchema, req.query);
        const queryArray = [];  
        // filters the query object into an array
        Object.entries(query).forEach(([key, value]) => {
            if(value !== null && key !== 'size' && key !== 'skip'){
                const obj = {
                    [`${key}`]: { $regex: new RegExp(value, 'i') }
                };
                queryArray.push(obj); 
            }
        }); 
        // check if the skip,size were provided 
        const skip = query['skip']?.length > 0 ? Number(query['skip']) : 0; 
        const size = query['size']?.length > 0 ? Number(query['size']) : null;
        let doctors; 
        if(queryArray.length < 1){
            doctors = await User.find({ role: "Doctor" }).skip(skip).limit(size);
        }else{
            doctors = await User.find({ role: "Doctor", $or: queryArray }).skip(skip).limit(size);
        }
        return res.status(StatusCodes.OK).json({success: true, doctors});
    }catch(err){
        return next(err); 
    }
}

export default getDoctors; 