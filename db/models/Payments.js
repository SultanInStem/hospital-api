import mongoose from "mongoose";
import Service from "./Service.js";

const refundSchema = new mongoose.Schema({
    previousAmount: {
        type: Number,
        required: true,
        min: 0  
    },
    deductedAmount: {
        type: Number,
        required: true,
        min: 0
    },
    finalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    refundedServices: {
        type: [Service.castObject()],
        default: []
    }
}, {timestamps: true})

const PaymentSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    netAmount: {
        type: Number,
        min: 0,
        required: true,
    },
    services: {
        type: [Service.castObject()],
        required: true
    },
    refundHistory: {
        type: [refundSchema],
        default: []
    }
}, { timestamps: true });




const Payment = mongoose.model('payments', PaymentSchema); 
export default Payment; 
