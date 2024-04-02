import { StatusCodes } from "http-status-codes";
import Payment from "../../../db/models/Payments.js";
const getPaymentSlip = async(req, res, next) => {
    try{
        const { id } = req.params; 
        const paymentSlip = await Payment.findById(id); 
        return res.status(StatusCodes.OK).json({success: true, paymentSlip}); 
    }catch(err){
        return next(err); 
    }
}


export default getPaymentSlip; 