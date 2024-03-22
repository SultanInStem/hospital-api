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
    }
}, {timestamps: true})

const PatientMedicalRecord = mongoose.model("PatientsMedicalRecords", Schema); 
export default PatientMedicalRecord; 