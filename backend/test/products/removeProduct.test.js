import mongoose from "mongoose"
import app from '../../server'
import connectDB from '../../config/db'
const request = require('supertest')
import generateToken from '../../utils/generateToken'
import User from '../../models/userModel'
import Product from '../../models/productModel'

jest.setTimeout(60000)
let userAdmin, tokenAdmin, userCus, tokenCus

describe('Remove Product', () => {
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

    it('Should remove product successfully with right id', async () => {
        const newProduct = await request(app).post('/api/products/')
            .set('Authorization', `Bearer ${tokenAdmin}`)
        const { body, statusCode } = await request(app).delete(`/api/products/${newProduct.body._id}`)
            .set('Authorization', `Bearer ${tokenAdmin}`)
        expect(statusCode).toBe(200)
        expect(body.message).toBe('Product removed')
    })

    it('Should remove product successfully with wrong id', async() => {
        const wrongID = '62ef3d72b3abcd0d9850b23d'
        const { body, statusCode } = await request(app).delete(`/api/products/${wrongID}`)
            .set('Authorization', `Bearer ${tokenAdmin}`)
        expect(statusCode).toBe(404)
        expect(body.message).toBe('Product not found')
    })

    it('Should remove product fail as a customer', async() => {
        const newProduct = await request(app).post('/api/products/')
            .set('Authorization', `Bearer ${tokenAdmin}`)
        const { statusCode } = await request(app).delete(`/api/products/${newProduct.body._id}`)
            .set('Authorization', `Bearer ${tokenCus}`)
        expect(statusCode).toBe(403)
    })

    it('Should remove product fail when unauthorized', async() => {
        const newProduct = await request(app).post('/api/products/')
            .set('Authorization', `Bearer ${tokenAdmin}`)
        const { statusCode } = await request(app).delete(`/api/products/${newProduct.body._id}`)
        expect(statusCode).toBe(401)
    })
})