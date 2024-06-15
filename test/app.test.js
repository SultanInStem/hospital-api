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
    it('POST /api/v1/auth/login', async function(){
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

    it("POST /api/v1/auth/refreshtoken", async() => {
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
        testData['patient'] = res.body.patients[0]; 
    }) 

    it('GET /api/v1/public/patients/single/:id', async function(){
        const res = await request(app)
        .get('/api/v1/public/patients/single/' + testData['patient']._id)
        .set('Authorization', 'Bearer ' + auth['accessToken'])
        .set('Content-Type', 'application/json')
        .expect(StatusCodes.OK); 

        assert(res.body.success); 

        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('patient');
    });

    it('GET /api/v1/public/services', async function(){
        const res = await request(app)
        .get('/api/v1/public/services/?size=-1')
        .set('Authorization', 'Bearer ' + auth['accessToken'])
        .set('Content-Type', 'application/json')
        .expect(StatusCodes.OK);

        assert(res.body.success); 

        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('services');
        expect(res.body.services).to.be.an('array');
        testData['service'] = res.body.services[0];
    })
    it('GET /api/v1/public/services/single/:id', async function(){
        const res = await request(app)
        .get('/api/v1/public/services/single/' + testData['service']._id)
        .set('Authorization', 'Bearer ' + auth['accessToken'])
        .set('Content-Type', 'application/json')
        .expect(StatusCodes.OK);

        assert(res.body.success); 

        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('service');
        expect(res.body.service).to.be.an('object');
    })

    it('GET /api/v1/public/medicalrecords', async function(){
        const res = await request(app)
        .get("/api/v1/public/medicalrecords")
        .set('Authorization', 'Bearer ' + auth['accessToken'])
        .set('Content-Type', 'application/json')
        .expect(StatusCodes.OK);  

        assert(res.body.success); 
        expect(res.body).to.be.an('object'); 
        expect(res.body).to.have.property('medicalRecords'); 
        expect(res.body.medicalRecords).to.be.an('array');
        testData['medicalRecord'] = res.body.medicalRecords[0];
    });

    it('GET /api/v1/public/medicalrecords/single/:id', async function(){
        const res = await request(app)
        .get("/api/v1/public/medicalrecords/single/" + testData['medicalRecord']._id)
        .set('Authorization', 'Bearer ' + auth['accessToken'])
        .set('Content-Type', 'application/json')
        .expect(StatusCodes.OK);  

        assert(res.body.success); 
        expect(res.body).to.be.an('object'); 
        expect(res.body).to.have.property('medicalRecord'); 
        expect(res.body.medicalRecord).to.be.an('object');
    });
    it('GET /api/v1/public/doctors', async function(){
        const res = await request(app)
        .get("/api/v1/public/doctors")
        .set('Authorization', 'Bearer ' + auth['accessToken'])
        .set('Content-Type', 'application/json')
        .expect(StatusCodes.OK);  

        assert(res.body.success); 
        expect(res.body).to.be.an('object'); 
        expect(res.body).to.have.property('doctors'); 
        expect(res.body.doctors).to.be.an('array');
        testData['doctor'] = res.body.doctors[0];
    })

    it('GET /api/v1/public/doctors/single/:id', async function(){
        const res = await request(app)
        .get("/api/v1/public/doctors/single/" + testData['doctor']._id)
        .set('Authorization', 'Bearer ' + auth['accessToken'])
        .set('Content-Type', 'application/json')
        .expect(StatusCodes.OK);  

        assert(res.body.success); 
        expect(res.body).to.be.an('object'); 
        expect(res.body).to.have.property('doctor'); 
        expect(res.body.doctor).to.be.an('object');
    })
    it('GET /api/v1/public/packages', async function(){
        const res = await request(app)
        .get("/api/v1/public/packages/?size=-1")
        .set('Authorization', 'Bearer ' + auth['accessToken'])
        .set('Content-Type', 'application/json')
        .expect(StatusCodes.OK);  

        assert(res.body.success); 
        expect(res.body).to.be.an('object'); 
        expect(res.body).to.have.property('packages'); 
        expect(res.body.packages).to.be.an('array');
    })
});