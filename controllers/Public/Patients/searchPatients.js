import { StatusCodes } from "http-status-codes";
import Patient from "../../../db/models/Patient.js";

const searchPatients = async (req, res, next) => {
    try{
        const { query } = req.query;
        const myQuery = new RegExp(query, 'i');
        const patients = await Patient.find({$or: [
            {firstName: {$regex: myQuery}},
            {lastName: {$regex: myQuery}},
            {phoneNumber: {$regex: myQuery}},
        ]}) 
        return res.status(StatusCodes.OK).json({success: true, patients }); 
    }catch(err){
        return next(err); 
    }
}


export default searchPatients;
