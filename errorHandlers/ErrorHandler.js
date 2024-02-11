const { StatusCodes } = require('http-status-codes');
const CustomError = require('../customErrors/CustomError'); 
const ErrorHandler = (err, req, res, next) => {
    if(err instanceof CustomError){
        return res.status(err.statusCode).json({success: false, msg: err.message})
    }
    console.log(err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false, msg: "Something went wrong"})
}
module.exports = ErrorHandler; 