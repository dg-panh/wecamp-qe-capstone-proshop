import mongoose from "mongoose"
import app from '../../server'
import connectDB from '../../config/db'
const request = require('supertest')
import generateToken from '../../utils/generateToken'
import User from '../../models/userModel'
import Product from '../../models/productModel'

jest.setTimeout(60000)
let userCus, userAdmin, tokenAdmin, testData, tokenCustomer, newProduct

describe('Create Review of Product', () => {
    beforeAll(async () => {
        await connectDB()
        userAdmin = await User.findOne({ email: 'admin@example.com' })
        tokenAdmin = generateToken(userAdmin._id)
        userCus = await User.findOne({ email: 'panh@gmail.com' })
        tokenCustomer = generateToken(userCus._id)
        testData = {
            "name": "Test Name",
            "rating": 4,
            "comment": "Test comment",
            "user": ""
        }
    })

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    })

    beforeEach(async () => {
        newProduct = await request(app).post('/api/products/')
            .set('Authorization', `Bearer ${tokenAdmin}`)
    })

    afterEach(async () => {
        await Product.deleteOne({ "_id": `${newProduct.body._id}` })
        app.close()
    })

    it('Should create review successfully with valid data (Admin)', async () => {
        testData.user = userAdmin._id
        const { body, statusCode } = await request(app).post(`/api/products/${newProduct.body._id}/reviews`)
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send(testData)
        expect(statusCode).toBe(201)
        expect(body.message).toBe('Review added')
    })

    it('Should create review successfully with valid data (Customer)', async () => {
        testData.user = `${userCus._id}`
        const { body, statusCode } = await request(app).post(`/api/products/${newProduct.body._id}/reviews`)
            .set('Authorization', `Bearer ${tokenCustomer}`)
            .send(testData)
        expect(statusCode).toBe(201)
        expect(body.message).toBe('Review added')
    })

    it('Should create review fail with wrong id product', async () => {
        testData.user = `${userCus._id}`
        const wrongID = '62ef3d72b3abcd0d9850b23d'
        const { body, statusCode } = await request(app).post(`/api/products/${wrongID}/reviews`)
            .set('Authorization', `Bearer ${tokenCustomer}`)
            .send(testData)
        expect(statusCode).toBe(404)
        expect(body.message).toBe('Product not found')
    })

    it('Should create review fail when user already review', async () => {
        testData.user = `${userCus._id}`
        await request(app).post(`/api/products/${newProduct.body._id}/reviews`)
            .set('Authorization', `Bearer ${tokenCustomer}`)
            .send(testData)
        const { body, statusCode } = await request(app).post(`/api/products/${newProduct.body._id}/reviews`)
            .set('Authorization', `Bearer ${tokenCustomer}`)
            .send(testData)
        expect(statusCode).toBe(400)
        expect(body.message).toBe('Product already reviewed')
    })

    it('Should create review fail when user had not login', async() => {
        const { statusCode } = await request(app).post(`/api/products/${newProduct.body._id}/reviews`)
            .send(testData)
        expect(statusCode).toBe(401)
    })

    describe('Create review of product that lacks the required field', () => {
        it('Should create review fail due to lack of user name', async () => {
            testData.name = ''
            testData.user = `${userCus._id}`
            const { statusCode } = await request(app).post(`/api/products/${newProduct.body._id}/reviews`)
                .set('Authorization', `Bearer ${tokenCustomer}`)
                .send(testData)
            expect(statusCode).toBe(400)
        })

        it('Should create review fail due to lack of rating', async () => {
            testData.rating = ''
            testData.user = `${userCus._id}`
            const { statusCode } = await request(app).post(`/api/products/${newProduct.body._id}/reviews`)
                .set('Authorization', `Bearer ${tokenCustomer}`)
                .send(testData)
            expect(statusCode).toBe(400)
        })

        it('Should create review fail due to lack of comment', async () => {
            testData.comment = ''
            testData.user = `${userCus._id}`
            const { statusCode } = await request(app).post(`/api/products/${newProduct.body._id}/reviews`)
                .set('Authorization', `Bearer ${tokenCustomer}`)
                .send(testData)
            expect(statusCode).toBe(400)
        })

        it('Should create review fail due to lack of user id', async () => {
            testData.user = ''
            testData.user = `${userCus._id}`
            const { statusCode } = await request(app).post(`/api/products/${newProduct.body._id}/reviews`)
                .set('Authorization', `Bearer ${tokenCustomer}`)
                .send(testData)
            expect(statusCode).toBe(400)
        })
    })

})