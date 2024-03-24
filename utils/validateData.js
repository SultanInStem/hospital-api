const validateData = async(joiSchema,data) => {
    try{
        const {error, value} = joiSchema.validate(data); 
        if(error) throw error;
        return value; 
    }catch(err){
        throw err;
    }
}
export default validateData;