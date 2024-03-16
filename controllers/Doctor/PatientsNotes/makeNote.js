import Note from "../../../db/models/Notes.js";
import Patient from "../../../db/models/Patient.js";
// import Doctor from "../../../db/models/Doctor.js";
import joi from "joi"; 
import { NotFound } from "../../../customErrors/Errors.js"; 
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
const validateData = async (data) => {
    try{
        const schema = joi.object({
            patientId: joi.string().required(),
            diagnosis: joi.string(),
            sidenote: joi.string().required(),
            docId: joi.string().required()
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
    let abort = false; 
    session.startTransaction(); 
    try{
        const data = await validateData(req.body);
        console.log(data['sidenote'])
        const doctor = await Doctor.findOne({_id: data['docId']},{firstName:1, lastName:1,specialty:1}); 
        if(!doctor) throw new NotFound("Doctor with specified ID does not exist..."); 
        const note = await Note.create([{
            diagnosis: data['diagnosis'],
            sidenote: data['sidenote'],
            diagnosedBy: doctor
        }]  , {session}); 
        const patient = await Patient.findOneAndUpdate(
            {_id: data['patientId']}, 
            { $push: { notes: note._id } }, 
            {session, projection: {notes: 1}}
        ); 
        if(!patient){
            abort = true; 
            throw new NotFound("Patient with specifed ID does not exist...");
        } 
        await session.commitTransaction(); 
        return res.status(StatusCodes.OK).json({success: true, note})
    }catch(err){
        return next(err); 
    }finally{
        if(abort){
            await session.abortTransaction(); 
        }
        await session.endSession();
    }
}

export default makeNote; 