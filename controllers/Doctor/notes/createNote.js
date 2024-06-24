import Note from "../../../db/models/Note.js";
import { StatusCodes } from "http-status-codes";
import joi from "joi"; 
import validateData from "../../../utils/validateData.js";

const joiSchema = joi.object({
    text: joi.string().required().min(5).max(100)
});


const createNote = async(req, res, next) => {
    try{

        return res.status(StatusCodes.OK).json({success: true});
    }catch(err){
        return next(err); 
    }
}

export default createNote;