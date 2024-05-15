import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['Cash', 'Card', 'Neither']
    },
    amountBeforeDeduction: {
        type: Number,
        min: 0,
        required: true,
    },
    bonusDeduction: {
        type: Number,
        min: 0,
        default: 0
    },
    amountFinal: {
        type: Number,
        min: 0,
        required: true
    },
    servicePaid:{ 
        type: mongoose.Types.ObjectId,
        required: true
    }, 
    isRefunded: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });




const Payment = mongoose.model('payments', PaymentSchema); 
export default Payment; 
