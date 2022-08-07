import mongoose from "mongoose"
import app from '../../server'
import connectDB from '../../config/db'
const request = require('supertest')
import generateToken from '../../utils/generateToken'
import User from '../../models/userModel'

jest.setTimeout(60000)
let userAdmin, tokenAdmin, userCus, tokenCus, newAccountCus
let data = {
    "name": "Customer",
    "email": "Customer@gmail.com",
    "password": "customer"
}
let dataUpdate = {
    "name": "Update Name",
    "email": "Update@gamil.com",
    "password": "update",
    "isAdmin": true
}

describe('Update User Profile (Personal Information)', () => {
    beforeAll(async () => {
        await connectDB()
    })

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    })

    beforeEach(async () => {
        newAccountCus = await request(app).post('/api/users/').send(data)
        userCus = await User.findOne({ email: `${data.email}` })
        tokenCus = generateToken(userCus._id)
    })

    afterEach(async () => {
        app.close()
    })

    it('Should update profile successfully with valid data', async () => {
        const { body, statusCode } = await request(app).put('/api/users/profile')
            .set('Authorization', `Bearer ${tokenCus}`)
            .send(dataUpdate)
        expect(statusCode).toBe(200)
        expect(body).toHaveProperty("token")
        await User.deleteOne({ "_id": `${body._id}` })
    })

    it('Should update profile fail when wrong token', async () => {
        await User.deleteOne({ "_id": `${newAccountCus.body._id}` })
        const { body, statusCode } = await request(app).put('/api/users/profile')
            .set('Authorization', `Bearer ${tokenCus}`)
            .send(dataUpdate)
        expect(statusCode).toBe(404)
        expect(body.message).toBe('User not found')
    })

    it('Should update profile successfully when lack of name', async () => {
        dataUpdate.name = null
        const { body, statusCode } = await request(app).put('/api/users/profile')
            .set('Authorization', `Bearer ${tokenCus}`)
            .send(dataUpdate)
        expect(statusCode).toBe(200)
        expect(body.name).toBe(newAccountCus.body.name)
        await User.deleteOne({ "_id": `${body._id}` })
    })

    it('Should update profile successfully when lack of email', async () => {
        dataUpdate.email = null
        const { body, statusCode } = await request(app).put('/api/users/profile')
            .set('Authorization', `Bearer ${tokenCus}`)
            .send(dataUpdate)
        expect(statusCode).toBe(200)
        expect(body.email).toBe(newAccountCus.body.email)
        await User.deleteOne({ "_id": `${body._id}` })
    })

})

describe('Update User (Manage User as Admin)', () => {
    beforeAll(async () => {
        await connectDB()
    })

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    })

    beforeEach(async () => {
        newAccountCus = await request(app).post('/api/users/').send(data)
        userAdmin = await User.findOne({ email: 'admin@example.com' })
        tokenAdmin = generateToken(userAdmin._id)
    })

    afterEach(() => {
        app.close()
    })

    it('Should update user successfully with valid data', async() => {
        const { body, statusCode } = await request(app).put(`/api/users/${newAccountCus.body._id}`)
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send(dataUpdate)
        expect(statusCode).toBe(200)
        expect(body.isAdmin).toBe(dataUpdate.isAdmin)
        await User.deleteOne({ "_id": `${body._id}` })
    })

    it('Should update user fail when wrong token', async () => {
        await User.deleteOne({ "_id": `${newAccountCus.body._id}` })
        const { body, statusCode } = await request(app).put(`/api/users/${newAccountCus.body._id}`)
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send(dataUpdate)
        expect(statusCode).toBe(404)
        expect(body.message).toBe('User not found')
    })

    it('Should update user fail when unauthorized', async () => {
        await User.deleteOne({ "_id": `${newAccountCus.body._id}` })
        const { body, statusCode } = await request(app).put(`/api/users/${newAccountCus.body._id}`)
            .send(dataUpdate)
        expect(statusCode).toBe(401)
    })

    it('Should update user successfully when lack of name', async () => {
        dataUpdate.name = null
        const { body, statusCode } = await request(app).put(`/api/users/${newAccountCus.body._id}`)
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send(dataUpdate)
        expect(statusCode).toBe(200)
        expect(body.name).toBe(newAccountCus.body.name)
        await User.deleteOne({ "_id": `${body._id}` })
    })

    it('Should update user successfully when lack of email', async () => {
        dataUpdate.email = null
        const { body, statusCode } = await request(app).put(`/api/users/${newAccountCus.body._id}`)
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send(dataUpdate)
        expect(statusCode).toBe(200)
        expect(body.email).toBe(newAccountCus.body.email)
        await User.deleteOne({ "_id": `${body._id}` })
    })
})