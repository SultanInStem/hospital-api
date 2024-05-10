import mongoose from "mongoose";

const refundSchema = new mongoose.Schema({
    previousAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    deductedAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    finalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    refundedServices: {
        type: [String],
        default: []
    },
    updatedAt: {
        type: Date,
        required: true
    }
});

const PaymentSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    initialAmount: {
        type: Number,
        min: 0,
        required: true,
    },
    bonusDeduction: {
        type: Number,
        min: 0,
        default: 0
    },
    finalAmount: {
        type: Number,
        min: 0,
        required: true
    },
    paidServices:{ 
        type: [String],
        required: true
    }, 
    refundHistory: {
        type: [refundSchema],
        default: []
    },
}, { timestamps: true });




const Payment = mongoose.model('payments', PaymentSchema); 
export default Payment; 
