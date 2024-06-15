import assert from "assert";
import login from "../controllers/Auth/Login.js";
import ErrorHandler from "../errorHandlers/ErrorHandler.js";
import { expect } from "chai";
import request from "supertest";
import app from "../app.js";
let server; 

beforeEach((done) => {
    server = app.listen(3001, done); 
})
afterEach((done) => {
    server.close(done);
})
describe('POST /api/v1/auth/login', function(){
    this.timeout(5000);
    it('shoud return 200 OK status', async function(){
            const res = await request(app)
            .post('/api/v1/auth/login')
            .send({ username: 'admin@gmail.com', password: "mypass123" })
            .expect(200)


            assert(res.body.success);
            expect(res.body.success === true);
        }
    )
})