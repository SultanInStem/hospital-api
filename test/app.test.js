import assert from "assert";
import login from "../controllers/Auth/Login.js";

describe('POST /api/v1/admin/login', function(){
    it('shoud retur 200 OK status', function(){
        const req = {}; 
        login(req); 
        
    })
})