const { StatusCodes } = require('http-status-codes');
const Doctor = require('../../db/models/Doctor'); 
const joi = require('joi'); 
const specialties = process.env.DOC_SPECIALTIES.split(','); 
const validateData = () => {
    try{
        const valSchema = joi.object({
            username: joi.string().required().min(5),
            password: joi.string().required().min(6), 
            firstName: joi.string().required().min(2),
            lastName: joi.string().required().min(2),
            specialty: joi.string().required()
        })
    }catch(err){
        throw err; 
    }
}

const createDoctor = async(req, res, next) => {
    try{
        console.log(specialties); 
        return res.status(StatusCodes.CREATED).json({success: true})
    }catch(err){
        return next(err); 
    }
}

module.exports = createDoctor; 