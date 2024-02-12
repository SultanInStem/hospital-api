import mongoose from 'mongoose'; 
const connect = async (uri) => {
    return mongoose.connect(uri); 
}

export default connect;