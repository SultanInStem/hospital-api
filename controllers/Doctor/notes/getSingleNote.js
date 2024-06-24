import { StatusCodes } from "http-status-codes";
import Note from "../../../db/models/Note.js";


const getSingleNote = async(req, res, next) => {
    try{
        const {id} = req.params; // note id 
        const note = await Note.findById(id); 
        return res.status(StatusCodes.OK).json({success: true, note});
    }catch(err){
        return next(err);
    }
}

export default getSingleNote;