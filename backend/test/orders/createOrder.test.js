import mongoose from "mongoose"
import app from '../../server'
import connectDB from '../../config/db'
const request = require('supertest')
import generateToken from '../../utils/generateToken'
import User from '../../models/userModel'
import Product from '../../models/productModel'
import Order from '../../models/orderModel'

jest.setTimeout(60000)
let user, userAdmin, tokenAdmin, tokenCustomer, newProduct
let testData = {
    "orderItems": [{
        "name": "Test Name",
        "qty": 1,
        "image": "/upload/testImg",
        "price": 2000,
        "product": ""
    }],
    "shippingAddress": {
        "address": "Test Address",
        "city": "Test City",
        "postalCode": "Test Code",
        "country": "Test country"
    },
    "paymentMethod": "Tets Payment Method",
    "taxPrice": 100,
    "shippingPrice": 100,
    "totalPrice": 100
}

describe('Create new order', () => {
    beforeAll(async () => {
        await connectDB()
        userAdmin = await User.findOne({ email: 'admin@example.com' })
        tokenAdmin = generateToken(userAdmin._id)
        user = await User.findOne({ email: 'panh@gmail.com' })
        tokenCustomer = generateToken(user._id)
    })

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    })

    beforeEach(async () => {
        newProduct = await request(app).post('/api/products/')
            .set('Authorization', `Bearer ${tokenAdmin}`)
        testData.orderItems[0].product = newProduct.body._id
    })

    afterEach(async () => {
        await Product.deleteOne({ "_id": `${newProduct.body._id}` })
        app.close()
    })

    it('Should create order successfully with valid data', async () => {
        const { body, statusCode } = await request(app).post('/api/orders')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send(testData)
        expect(statusCode).toBe(201)
        expect(body).toHaveProperty("_id")
        expect(body).toHaveProperty("user")
        await Order.deleteOne({ "_id": `${body._id}` })
    })

    it('Should create order successfully with valid data', async () => {
        const { body, statusCode } = await request(app).post('/api/orders')
            .set('Authorization', `Bearer ${tokenCustomer}`)
            .send(testData)
        expect(statusCode).toBe(201)
        expect(body).toHaveProperty("_id")
        expect(body).toHaveProperty("user")
        await Order.deleteOne({ "_id": `${body._id}` })
    })

    it('Should create order fail due to do not have item in request body', async () => {
        testData.orderItems.splice(0, 1)
        const { body, statusCode } = await request(app).post('/api/orders')
            .set('Authorization', `Bearer ${tokenCustomer}`)
            .send(testData)
        expect(statusCode).toBe(400)
        expect(body.message).toBe('No order items')
        testData.orderItems[0] = {
            "name": "Test Name",
            "qty": 1,
            "image": "/upload/testImg",
            "price": 2000,
            "product": ""
        }
    })

    it('Should create order fail due to user had not login', async () => {
        const { body, statusCode } = await request(app).post('/api/orders')
            .send(testData)
        expect(statusCode).toBe(401)
    })

    it('Should create order fail due to lack of shipping address', async () => {
        testData.shippingAddress = ''
        const { body, statusCode } = await request(app).post('/api/orders')
            .set('Authorization', `Bearer ${tokenCustomer}`)
            .send(testData)
        expect(statusCode).toBe(400)
        
    })

    it('Should create order fail due to lack of payment method', async () => {
        testData.paymentMethod = ''
        const { body, statusCode } = await request(app).post('/api/orders')
            .set('Authorization', `Bearer ${tokenCustomer}`)
            .send(testData)
        expect(statusCode).toBe(400)
    })

    it('Should create order fail due to lack of tax price', async () => {
        testData.taxPrice = ''
        const { body, statusCode } = await request(app).post('/api/orders')
            .set('Authorization', `Bearer ${tokenCustomer}`)
            .send(testData)
        expect(statusCode).toBe(400)
    })

    it('Should create order fail due to lack of shipping price', async () => {
        testData.shippingPrice = ''
        const { body, statusCode } = await request(app).post('/api/orders')
            .set('Authorization', `Bearer ${tokenCustomer}`)
            .send(testData)
        expect(statusCode).toBe(400)
    })

    it('Should create order fail due to lack of total price', async () => {
        testData.totalPrice = ''
        const { body, statusCode } = await request(app).post('/api/orders')
            .set('Authorization', `Bearer ${tokenCustomer}`)
            .send(testData)
        expect(statusCode).toBe(400)
    })
})