import assert from "assert";
import { StatusCodes } from "http-status-codes";
import { expect } from "chai";
import request from "supertest";
import app from "../app.js";

let server; 
const auth = {}; 
const testData = {};
beforeEach((done) => {
    server = app.listen(3001, done); 
})
afterEach((done) => {
    server.close(done);
})
describe('AUTH ROUTER /api/v1/auth', function(){
    // this.timeout(5000);
    it('should return 200 OK', async function(){
            const res = await request(app)
            .post('/api/v1/auth/login')
            .send({ username: 'admin@gmail.com', password: "mypass123" })
            .expect(StatusCodes.OK)

            assert(res.body.success);
            expect(res.body.success); 
            expect(res).to.be.an('object');

            expect(res.body).to.have.property('accessToken');
            expect(res.body).to.have.property('refreshToken');
            expect(res.body).to.have.property('success');
            expect(res.body).to.have.property('username');
            expect(res.body).to.have.property('role');
            auth['refreshToken'] = res.body.refreshToken; 
            auth['accessToken'] = res.body.accessToken; 
        }
    )

    // it('Create-manager, should return 201 CREATED', async () => {
    //     const data = {
    //         firstName: "Manager", 
    //         lastName: "Test", 
    //         phoneNumber: "+99890-671-12-12", 
    //         username: "test.manager2@gmail.com", 
    //         password: "mypass123", 
    //         key: process.env.MONGO_MANAGER_KEY
    //     }
    //     const res = await request(app)
    //     .post('/api/v1/auth/create-manager')
    //     .send(data)
    //     .expect(StatusCodes.CREATED)

    //     assert(res.body.success);
    //     expect(res).to.be.an('object');
    // }) 

    it("Refresh token api", async() => {
        const res = await request(app)
        .post('/api/v1/auth/refreshtoken')
        .send({refreshToken: auth['refreshToken']})
        .expect(StatusCodes.OK)
        
        assert(res.body.success); 
        expect(res).to.be.an('object'); 
        expect(res.body).to.have.property('accessToken');
        expect(res.body).to.have.property('refreshToken');
        auth['refreshToken'] = res.body.refreshToken; 
        auth['accessToken'] = res.body.accessToken; 

    })
});


describe('PUBLIC ROUTER, /api/v1/public', () => {
    it('GET /api/v1/public/patients', async() => {
        const res = await request(app)
        .get('/api/v1/public/patients')
        .set('Authorization', 'Bearer ' + auth['accessToken'])
        .set('Content-Type', 'application/json')
        .expect(StatusCodes.OK); 
        
        assert(res.body.success); 
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('patients');
        expect(res.body.patients).to.be.an('array');
    }) 

    it('GET /api/v1/public/patients/single/:id', async function(){
        const res = await request(app)
        .get('/api/v1/public/patients/single/:id')
        .set('Authorization', 'Bearer ' + auth['accessToken'])
        .set('Content-Type', 'application/json')
        .expect(StatusCodes.OK)
    })
});