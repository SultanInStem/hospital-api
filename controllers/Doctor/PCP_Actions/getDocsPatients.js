import Patient from "../../../db/models/Patient.js";
import User from "../../../db/models/User.js";
import { NotFound } from "../../../customErrors/Errors.js";
import { StatusCodes } from "http-status-codes";


const getDocsPatients = async(req, res, next) => {
    try{
        const docId = req.userId; 
        const doctor = await User.findById(docId);
        const currentUnix = new Date().getTime();

        if(!doctor || doctor.role !== 'Doctor') throw new NotFound(`Doctor account with this ${docId} not found`);
        const patients = await Patient.find(
            { 
                PCP: doctor._id,
                expiresAt: {$gte: currentUnix},
                packages: {$exists: true, $ne: []}
            }, 
            { firstName: 1, lastName: 1 }
        );

        const response = {
            success: true, 
            patients
        }
        return res.status(StatusCodes.OK).json(response); 
    }catch(err){
        return next(err); 
    }
}

export default getDocsPatients; 