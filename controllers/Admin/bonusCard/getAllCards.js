import BonusCard from "../../../db/models/BonusCard.js";
import { StatusCodes } from "http-status-codes";

const getAllCards = async(req, res, next) => {
    try{
        const bonusCards = await BonusCard.find(); 
        const response = {
            success: true,
            bonusCards
        }; 
        return res.status(StatusCodes.OK).json(response);
    }catch(err){
        return next(err); 
    }
}

export default getAllCards; 