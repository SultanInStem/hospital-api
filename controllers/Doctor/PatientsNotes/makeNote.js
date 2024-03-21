import Note from "../../../db/models/Notes.js";
import Patient from "../../../db/models/Patient.js";
import User from "../../../db/models/User.js"; 
import joi from "joi"; 
import { NotFound, Unauthorized } from "../../../customErrors/Errors.js"; 
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
const validateData = async (data) => {
    try{
        const schema = joi.object({
            patientId: joi.string().required(),
            diagnosis: joi.string(),
            sidenote: joi.string().required(),
        })
        const {error,value} = schema.validate(data); 
        if(error) throw error; 
        return value; 
    }catch(err){
        throw err;
    }
}
const makeNote = async (req, res, next) => {
    const session = await mongoose.startSession(); 
    session.startTransaction(); 
    let isTransactionFailed = false; 
    try{
        const {isAdmin, userId} = req;
        const doctor = await User.findOne({_id: userId}, {firstName: 1, lastName: 1, specialty: 1}); 
        if(isAdmin) throw new Unauthorized("Only doctors are allowed to diagnoze."); 
        else if(!doctor) throw new NotFound("Doctor with this ID not found.")


        const data = await validateData(req.body);
        const note = new Note({
            patientId: data['patientId'],
            diagnosis: data['diagnosis'] ? data['diagnosis'] : null, 
            sidenote: data['sidenote'],
            diagnosedBy: doctor
        }); 

        const patient = await Patient.findOneAndUpdate(
            {_id: data['patientId']}, 
            {$push: {notes: note._id}}, 
            {session}
        ); 
        if(!patient) throw new NotFound("Patient with given ID not found"); 

        await note.save({session}); 
        await session.commitTransaction(); 
        return res.status(StatusCodes.OK).json({success: true, note, msg: "Note has been added"})
    }catch(err){
        isTransactionFailed = true; 
        return next(err); 
    }finally{
        if(isTransactionFailed){
            await session.abortTransaction();
        }
        await session.endSession(); 
    }
}

export default makeNote; 