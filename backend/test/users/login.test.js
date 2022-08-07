import mongoose from "mongoose"
import app from '../../server'
import connectDB from '../../config/db'
const request = require('supertest')
import generateToken from '../../utils/generateToken'
import User from '../../models/userModel'

jest.setTimeout(60000)
let testData = {
    "name": "Test Name",
    "email": "TestEmail@gmail.com",
    "password": "testPassword"
}
let newAccount

describe('Login', () => {
    beforeAll(async () => {
        await connectDB()
    })

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    })

    beforeEach(async () => {
        newAccount = await request(app).post('/api/users/').send(testData)
    })

    afterEach(async () => {
        await User.deleteOne({ "_id": `${newAccount.body._id}` })
        app.close()
    })

    it('Should login successfully with valid data', async () => {
        const { body, statusCode } = await request(app).post('/api/users/login')
            .send(testData)
        expect(statusCode).toBe(200)
        expect(body).toHaveProperty("token")
    })

    it('Should login fail with wrong email', async () => {
        testData.email = 'wrongEmail@gmail.com'
        const { body, statusCode } = await request(app).post('/api/users/login')
            .send(testData)
        expect(statusCode).toBe(401)
        expect(body.message).toBe('Invalid email or password')
    })

    it('Should login fail with wrong password', async () => {
        testData.password = 'wrongPassword'
        const { body, statusCode } = await request(app).post('/api/users/login')
            .send(testData)
        expect(statusCode).toBe(401)
        expect(body.message).toBe('Invalid email or password')
    })

    it('Should login fail with wrong email and password', async () => {
        testData.email = 'wrongEmail@gmail.com'
        testData.password = 'wrongPassword'
        const { body, statusCode } = await request(app).post('/api/users/login')
            .send(testData)
        expect(statusCode).toBe(401)
        expect(body.message).toBe('Invalid email or password')
    })

    it('Should login fail when lack of email', async () => {
        testData.email = null
        const { body, statusCode } = await request(app).post('/api/users/login')
            .send(testData)
        expect(statusCode).toBe(400)
    })

    it('Should login fail when lack of password', async () => {
        testData.password = null
        const { body, statusCode } = await request(app).post('/api/users/login')
            .send(testData)
        expect(statusCode).toBe(400)
    })

})