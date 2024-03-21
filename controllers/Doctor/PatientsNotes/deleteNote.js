import Note from "../../../db/models/Notes.js";
import User from "../../../db/models/User.js";
import Patient from "../../../db/models/Patient.js";
import { StatusCodes } from "http-status-codes";
import { BadRequest, NotFound, Unauthorized } from "../../../customErrors/Errors.js";

const deleteNote = async (req, res, next) => {
    try{
        const {isAdmin} = req; 
        if(isAdmin) throw new Unauthorized("Admins are not allowed to delete doctor's notes")
        const { id } = req.params
        const note = await Note.findOneAndDelete({_id: id}); 
        if(!note) throw new NotFound("Note with that ID not found"); 
        const patientId = note.patientId; 
        const patient = await Patient.findOneAndUpdate({_id: patientId}, {$pull: {notes: id}})
        return res.status(StatusCodes.OK).json({success: true, msg: "note has been deleted", deletedNote: note}); 
    }catch(err){
        return next(err); 
    }
}


export default deleteNote; 