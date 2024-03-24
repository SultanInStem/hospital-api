import mongoose from "mongoose";
import Service from "./Service.js"; 
const Schema = new mongoose.Schema({
    services: {
        type: [Service.castObject()],
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    patientId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: "pending"
    }
}, {timestamps: true})

const PatientMedicalRecord = mongoose.model("PatientsMedicalRecords", Schema); 
export default PatientMedicalRecord; 