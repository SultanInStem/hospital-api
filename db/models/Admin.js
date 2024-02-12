import mongoose from "mongoose"; 
import bcrypt from "bcryptjs"; 
const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

AdminSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(); 
    const password = await bcrypt.hash(this.password, salt);
    this.password = password;
})

AdminSchema.methods.ValidatePassword = async function(password){
    const isMatch = await bcrypt.compare(password, this.password); 
    return isMatch; 
}
const Admin = mongoose.model('Admins', AdminSchema); 
export default Admin;