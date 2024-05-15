import mongoose from "mongoose";
const serviceSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId, 
        required: true
    },
    title: {
        type: String,
        required: true
    },
    providedBy: {
        type: mongoose.Types.ObjectId,
        required: true
    }
})
const Schema = new mongoose.Schema({
    paymentSlip: {
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
        default: "pending",
        index: true
    },
    allDoctorsInvolved: {
        type: Map,
        required: true
    }
}, {timestamps: true})

const PatientMedicalRecord = mongoose.model("PatientsMedicalRecords", Schema); 
export default PatientMedicalRecord; 