const mongoose = require('mongoose'); 
const bcrypt  = require('bcryptjs')
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

const Admin = mongoose.model('Admins', AdminSchema); 

module.exports = Admin; 