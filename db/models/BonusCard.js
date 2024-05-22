import mongoose from "mongoose";


const BonusCardSchema = new mongoose.Schema({
    balance: {
        type: Number,
        required: true,
        default: 0, 
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        requried: true
    },
    cardId: {
        type: String,
        required: true,
        unique: true
    }
}); 

const BonusCard = mongoose.model('bonusCard', BonusCardSchema);
export default BonusCard;