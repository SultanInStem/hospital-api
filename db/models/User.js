import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const UserSchema = new mongoose.Schema({
    isAdmin: {
        required: true,
        type: Boolean
    },
    role: {
        type: String,
        required: true,
        enum: ['Admin', 'Doctor', 'Nurse']
    },
    username: {
        type: String, 
        unique: true,
        required: true
    },
    password: {
        type: String, 
        required: true
    },
    specialty: {
        type: String,
        enum: ['Cardiologist', 'Dermatologist', 'Pediatrician'],
        required: function(){
            if(this.role === 'Nurse' || this.role === 'Admin' ) return false;
            else return true;  
        }
    }, 
    firstName: {
        type: String, 
        required: function(){
            return !this.isAdmin; 
        }
    },
    lastName: {
        type: String, 
        required: function(){
            return !this.isAdmin; 
        }
    },
    phoneNumber: {
        type: String,
        required: function(){
            return !this.isAdmin; 
        }
    }
});

UserSchema.pre("save", async function(){
    const salt = await bcrypt.genSalt(); 
    const hashedPassword = await bcrypt.hash(this.password,salt); 
    this.password = hashedPassword;   
})

UserSchema.methods.ValidatePassword = async function(password){
    return await bcrypt.compare(password, this.password); 
}

const User = mongoose.model("users", UserSchema); 

export default User;