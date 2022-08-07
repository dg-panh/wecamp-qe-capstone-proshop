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

describe('Create Product', () => {
    beforeAll(async () => {
        await connectDB()
    })

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    })

    afterEach(() => {
        app.close()
    })

    it('Should create account successfully with valid data', async () => {
        const { body, statusCode } = await request(app).post('/api/users/')
            .send(testData)
        expect(statusCode).toBe(201)
        expect(body).toHaveProperty("token")
        await User.deleteOne({ "_id": `${body._id}` })
    })

    it('Should create account fail when duplicate email with other account', async () => {
        const firstAccount = await request(app).post('/api/users/')
            .send(testData)
        const { body, statusCode } = await request(app).post('/api/users/')
            .send(testData)
        expect(statusCode).toBe(400)
        expect(body.message).toBe('User already exists')
        await User.deleteOne({ "_id": `${firstAccount.body._id}` })
    })

    it('Should create account fail due to lack of name', async () => {
        testData.name = ''
        const { body, statusCode } = await request(app).post('/api/users/')
            .send(testData)
        expect(statusCode).toBe(400)
        expect(body.message).toBe('Invalid user data')
    })

    it('Should create account fail due to lack of email', async () => {
        testData.email = ''
        const { body, statusCode } = await request(app).post('/api/users/')
            .send(testData)
        expect(statusCode).toBe(400)
        expect(body.message).toBe('Invalid user data')
    })

    it('Should create account fail due to lack of password', async () => {
        testData.password = ''
        const { body, statusCode } = await request(app).post('/api/users/')
            .send(testData)
        expect(statusCode).toBe(400)
        expect(body.message).toBe('Invalid user data')
    })
})