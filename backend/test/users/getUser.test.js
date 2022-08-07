import mongoose from "mongoose"
import app from '../../server'
import connectDB from '../../config/db'
const request = require('supertest')
import generateToken from '../../utils/generateToken'
import User from '../../models/userModel'

jest.setTimeout(60000)
let userAdmin, tokenAdmin, userCus, tokenCus
let testData = {
    "name": "Test Name",
    "email": "TestEmail@gmail.com",
    "password": "testPassword"
}

describe('Get users', () => {
    beforeAll(async () => {
        await connectDB()
        userAdmin = await User.findOne({ email: 'admin@example.com' })
        tokenAdmin = generateToken(userAdmin._id)
        userCus = await User.findOne({ email: 'panh@gmail.com' })
        tokenCus = generateToken(userCus._id)
    })

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    })

    afterEach(() => {
        app.close()
    })

    it('Should get all users', async () => {
        const { body, statusCode } = await request(app).get('/api/users/')
            .set('Authorization', `Bearer ${tokenAdmin}`)
        expect(statusCode).toBe(200)
        expect(body[0]).toHaveProperty('_id')
        expect(body[0]).toHaveProperty('email')
        expect(body[0]).toHaveProperty('name')
        expect(body[0]).toHaveProperty('password')
        expect(body[0]).toHaveProperty('isAdmin')
    })

    it('Should get all users with Forbidden', async () => {
        const { body, statusCode } = await request(app).get('/api/users/')
            .set('Authorization', `Bearer ${tokenCus}`)
        expect(statusCode).toBe(403)
    })

    it('Should get all users with unauthorized', async () => {
        const { body, statusCode } = await request(app).get('/api/users/')
        expect(statusCode).toBe(401)
    })

    it('Should get user successfully with right id', async () => {
        const newAccount = await request(app).post('/api/users/')
            .send(testData)
        const { body, statusCode } = await request(app).get(`/api/users/${newAccount.body._id}`)
            .set('Authorization', `Bearer ${tokenAdmin}`)
        expect(statusCode).toBe(200)
        expect(body.email).toBe(testData.email)
        await User.deleteOne({ "_id": `${newAccount.body._id}` })
    })

    it('Should get user fail with wrong id', async() => {
        const newAccount = await request(app).post('/api/users/')
            .send(testData)
        await User.deleteOne({ "_id": `${newAccount.body._id}` })
        const { body, statusCode } = await request(app).get(`/api/users/${newAccount.body._id}`)
            .set('Authorization', `Bearer ${tokenAdmin}`)
        expect(statusCode).toBe(404)
        expect(body.message).toBe('User not found')
        
    })

    it('Should get user fail with right id as customer', async () => {
        const newAccount = await request(app).post('/api/users/')
            .send(testData)
        const { body, statusCode } = await request(app).get(`/api/users/${newAccount.body._id}`)
            .set('Authorization', `Bearer ${tokenCus}`)
        await User.deleteOne({ "_id": `${newAccount.body._id}` })
        expect(statusCode).toBe(403)
    })
})