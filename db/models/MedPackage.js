import mongoose from "mongoose";

const PackageSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: true 
    },
    servicesAllowed: {
        type: [mongoose.Types.ObjectId],
        required: true
    }
}); 


export default MedPackage = mongoose.model('MedPackages', PackageSchema); 
