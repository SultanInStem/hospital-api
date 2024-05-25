import Payment from "../../db/models/Payments.js"; 
import { StatusCodes } from "http-status-codes";
import joi from "joi"; 
import validateData from "../../utils/validateData.js"; 
import { NotFound } from "../../customErrors/Errors.js";
const ID_LENGTH = Number(process.env.MONGO_MIN_ID_LENGTH); 

const joiSchema = joi.object({
    size: joi.string().regex(/^\d+$/).optional(),
    patientId: joi.string().min(ID_LENGTH).optional(),
    paymentId: joi.string().min(ID_LENGTH).optional(),
    gte: joi.string().regex(/^\d+$/).optional(),
    lte: joi.string().regex(/^\d*\.?\d+/).optional(),
    skip: joi.string().regex(/^\d+$/).optional(),
    startDate: joi.string().optional(),
    endDate: joi.string().optional(), 
    paymentMethod: joi.string().valid('Cash', 'Card').optional()
}); 

const getPaymnets = async(req, res, next) => {
    try{
        const data = await validateData(joiSchema,req.query);
        const currentTime = new Date().getTime(); 
        const TIME_INTERVAL = 1000 * 60 * 60 * 24 * 30 * 6; // six months in miliseconds 
        if(data['paymentId']){
            const payment = await Payment.findById(data['paymentId']);
            if(!payment) throw new NotFound(`Payment with ID ${data['paymentId']} not found`); 
            return res.status(StatusCodes.OK).json({success: true, payments: [payment]});
        }

        
        const size = data['size'] ? Number(data['size']) : 50;  // set default size 
        const skip = data['skip'] ? Number(data['skip']) : null; // set default skip 


        Object.entries(data).forEach(([key, value]) => { // turn strings into numbers if they represent numbers 
            if(!isNaN(value)){
                data[key] = Number(value); 
            }
        })

        // verifying startDate and endDate
        if(!data['startDate'] && !data['endDate']){ // if startDate and endDate = null, count from TIME_INTERVAL ago til currentDate
            data['startDate'] = currentTime - TIME_INTERVAL; 
            data['endDate'] = currentTime; 
        }if(!data['startDate'] && data['endDate']){
            data['startDate'] = data['endDate' - TIME_INTERVAL]; 
        }if(data['startDate'] && !data['endDate']){
            data['endDate'] = currentTime; 
        }if(data['endDate'] - data['startDate'] < 0){
            data['startDate'] = currentTime - TIME_INTERVAL; 
            data['endDate'] = currentTime; 
        }

        let gte = 0; 
        let lte = Infinity; 
        if(data['gte'] >= 0){
            gte = data['gte']; 
        }if(data['lte'] >= 0){
            lte = data['lte']
        }if(data['lte'] <= data['gte']){
            lte = Infinity;
        }
        const filter = {
            paymentMethod: data['paymentMethod'],
            patientId: data['patientId'],
        };
        if(!filter['paymentMethod']) delete filter['paymentMethod']; 
        if(!filter['patientId']) delete filter['patientId']; 
        const paymentRecords = await Payment.find(
            {
                createdAt: { 
                    $gte: data['startDate'],
                    $lte: data['endDate']
                },
                amountFinal: {
                    $gte: gte,
                    $lte: lte
                },
                ...filter
            }
        ).limit(size).skip(skip);

        const response = {
            success: true, 
            paymentRecords
        }; 
        return res.status(StatusCodes.OK).json(response); 
    }catch(err){
        return next(err);
    }
}

export default getPaymnets; 