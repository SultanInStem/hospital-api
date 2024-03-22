import mongoose from "mongoose";


const ServiceSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    }, 
    providedBy: {
        type: mongoose.Types.ObjectId,
        required: true
    }
}, {timestamps: true})


const Service = mongoose.model("Services", ServiceSchema); 


export default Service; 





