import User from '../../../db/models/User.js';
import { StatusCodes } from 'http-status-codes';
import { NotFound, BadRequest } from '../../../customErrors/Errors.js';

const deleteDoctor = async (req, res, next) => {
    try{
    }catch(err){
        return next(err); 
    }
}

export default deleteDoctor;