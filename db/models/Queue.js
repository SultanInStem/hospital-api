import mongoose from "mongoose";


const PatientInQueue = new mongoose.Schema({
    patientId:{
        type: mongoose.Types.ObjectId,
        required: true
    },
    doctors: {
        type: Object,
        required: true
    }
}, {timestamps: true})
const QueueSchema = new mongoose.Schema({
    patientQueue: {
        type: [PatientInQueue]
    }
}) 

const Queue = mongoose.model("NetQueue", QueueSchema); 

export default Queue; 


