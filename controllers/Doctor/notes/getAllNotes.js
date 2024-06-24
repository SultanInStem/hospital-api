import { StatusCodes } from "http-status-codes";
import Note from "../../../db/models/Note.js";

const getAllNotes = async(req, res, next) => {
    try{
        const { id } = req.params; // patient id 
        const notes = await Note.find({ patientId: id });
        return res.status(StatusCodes.OK).json({success: true, notes});
    }catch(err){
        return next(err); 
    }
}

export default getAllNotes; 