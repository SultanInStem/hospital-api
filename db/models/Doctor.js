import mongoose from "mongoose"; 
import bcrypt from "bcryptjs"; 
const DocSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }, 
    specialty: {
        type: String,
        required: true 
    }
})

DocSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(); 
    const password = await bcrypt.hash(this.password, salt); 
    this.password = password; 
})

DocSchema.methods.ValidatePassword = async function(password){
    return await bcrypt.compare(password, this.password); 
}

const Doctor = mongoose.model('doctors', DocSchema);

export default Doctor;