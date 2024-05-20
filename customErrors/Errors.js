import CustomError from "./CustomError.js"; 
import { StatusCodes } from 'http-status-codes';
export class NotFound extends CustomError{
    constructor(message){
        super(message); 
        this.statusCode = StatusCodes.NOT_FOUND;  
    }
}
export class BadRequest extends CustomError{
    constructor(message){
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST; 
    }
}
export class Unauthorized extends CustomError{
    constructor(message){
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED; 
    }
}

export class ServerError extends CustomError{
    constructor(message){
        super(message); 
        this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }
}