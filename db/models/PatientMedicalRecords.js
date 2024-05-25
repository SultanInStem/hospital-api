import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    isInpatient: {
        type: Boolean, 
        required: true
    },
    paymentRecord: {
        type: mongoose.Types.ObjectId,
        required: function(){
            return !this.isInpatient;
        }
    },
    serviceId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    serviceTitle: {
        type: String, 
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
        enum: ['queue', 'completed', 'refunded', 'toRefund'],
        default: "queue",
        index: true
    },
    createdAt: {
        type: Number,
        required: true
    }
}, {timestamps: true})

const PatientMedicalRecord = mongoose.model("PatientsMedicalRecords", Schema); 
export default PatientMedicalRecord; 