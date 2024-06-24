import { StatusCodes } from "http-status-codes";
import Note from "../../../db/models/Note.js";

const getDocsNotes = async(req, res, next) => {
    try{
        const docsId = req.userId; 
        const {id} = req.params; // patient id 
        const notes = await Note.find({ patientId: id, writtenBy: docsId });
        return res.status(StatusCodes.OK).json({success: true, notes});
    }catch(err){
        return next(err); 
    }
}
export default getDocsNotes; 