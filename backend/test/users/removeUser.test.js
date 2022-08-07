import mongoose from "mongoose"
import app from '../../server'
import connectDB from '../../config/db'
const request = require('supertest')
import generateToken from '../../utils/generateToken'
import User from '../../models/userModel'

jest.setTimeout(60000)
let userAdmin, tokenAdmin, userCus, tokenCus, newAccount
let testData = {
    "name": "Test Name",
    "email": "TestEmail@gmail.com",
    "password": "testPassword"
}

describe('Remove User', () => {
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

    beforeEach(async() => {
        newAccount = await request(app).post('/api/users/')
            .send(testData)
    })

    afterEach(async() => {
        app.close()
    })

    it('Should remove user successfully', async() => {
        const { body, statusCode } = await request(app).delete(`/api/users/${newAccount.body._id}`)
            .set('Authorization', `Bearer ${tokenAdmin}`)
        expect(statusCode).toBe(200)
        expect(body.message).toBe('User removed')
    })

    it('Should remove user fail with wrong id', async() => {
        await User.deleteOne({ "_id": `${newAccount.body._id}` })
        const { body, statusCode } = await request(app).delete(`/api/users/${newAccount.body._id}`)
            .set('Authorization', `Bearer ${tokenAdmin}`)
        expect(statusCode).toBe(404)
        expect(body.message).toBe('User not found')
    })

    it('Should remove user fail when Forbidden', async() => {
        const { body, statusCode } = await request(app).delete(`/api/users/${newAccount.body._id}`)
            .set('Authorization', `Bearer ${tokenCus}`)
        await User.deleteOne({ "_id": `${newAccount.body._id}` })
        expect(statusCode).toBe(403)
    })

    it('Should remove user fail when unauthorized', async() => {
        const { body, statusCode } = await request(app).delete(`/api/users/${newAccount.body._id}`)
        expect(statusCode).toBe(401)
        await User.deleteOne({ "_id": `${newAccount.body._id}` })
    })
})