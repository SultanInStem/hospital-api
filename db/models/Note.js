import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
    text: {
        type: String, 
        requried: true
    },
    patientId: {
        type: mongoose.Types.ObjectId, 
        requried: true
    },
    docsFirstName: {
        type: String,
        required: true
    },    
    docsLastName: {
        type: String, 
        required: true
    },
    docsSpecialty: {
        type: Array, 
        requried: true
    }, 
    createdAt: {
        type: Number, 
        required: true
    }
});

const Note = mongoose.model("notes", NoteSchema); 

export default Note; 