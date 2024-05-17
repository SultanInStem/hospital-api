import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    paymentRecord: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    service: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    patientId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    patientFirstName: {
        type: String, 
        required: true
    },
    patientLastName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['queue', 'completed', 'refunded'],
        default: "queue",
        index: true
    },
    createdAt: {
        type: Number,
        reuqired: true
    }
}, {timestamps: true})

const PatientMedicalRecord = mongoose.model("PatientsMedicalRecords", Schema); 
export default PatientMedicalRecord; 