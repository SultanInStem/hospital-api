import { StatusCodes } from "http-status-codes";
import joi from "joi"; 
import validateData from "../../../utils/validateData.js";
import Payment from "../../../db/models/Payments.js";
import { NotFound } from "../../../customErrors/Errors.js";
const joiSchema = joi.object({
    size: joi.string().regex(/^\d+$/).optional(),
    patientId: joi.string().min(22).optional(),
    paymentId: joi.string().min(22).optional(),
    gte: joi.string().regex(/^\d+$/).optional(),
    lte: joi.string().regex(/^\d*\.?\d+/).optional(),
    skip: joi.string().regex(/^\d+$/).optional(),
    startDate: joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    endDate: joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
}); 
const getPayments = async(req, res, next) => {
    try{
        const query = req.query; 
        const data = await validateData(joiSchema, query); 
        if(data['paymentId']){
            const payment = await Payment.findById(data['paymentId']); 
            if(!payment) throw new NotFound("Payment record with that id is not found");
            return res.status(StatusCodes.OK).json({success: true, payment})
        }

        const size = data['size'] ? Number(data['size']) : 50; 
        const skip = data['skip'] ? Number(data['skip']) : null; 

        // set the time intervals if they weren't provided OR were provided incorrectly
        if(!data['startDate'] || data['startDate'] > data['endDate']){
            const currentDate = new Date(); 
            const sixMonthsAgo = new Date(currentDate); 
            sixMonthsAgo.setMonth(currentDate.getMonth() - 6); 
            data['startDate'] = sixMonthsAgo;
        }if(!data['endDate'] || data['startDate'] > data['endDate']){
            data['endDate'] = new Date(); 
        }
        const startDate = data['startDate']; 
        const endDate = data['endDate']; 
  
        // turn strings to numbers 
        Object.entries(data).forEach(([key, value]) => {
            if(!isNaN(value)){
                data[key] = Number(value); 
            }
        });
        let gte = 0;
        let lte = Infinity;
        if(data['gte'] >= 0){
            gte = data['gte']; 
        }if(data['lte'] >= 0){
            lte = data['lte']
        }if(data['lte'] <= data['gte']){
            lte = Infinity;
        }


        const paymentRecords = await Payment.find(
            {
                createdAt: { 
                    $gte: startDate,
                    $lte: endDate
                },
                netAmount: {
                    $gte: gte,
                    $lte: lte
                }
            }
        ).limit(size).skip(skip);

        return res.status(StatusCodes.OK).json({success: true, paymentRecords}); 
    }catch(err){
        return next(err);
    }
}

export default getPayments; 