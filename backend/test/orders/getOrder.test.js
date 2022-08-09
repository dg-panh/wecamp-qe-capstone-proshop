import mongoose from "mongoose"
import app from '../../server'
import connectDB from '../../config/db'
const request = require('supertest')
import generateToken from '../../utils/generateToken'
import User from '../../models/userModel'
import Product from '../../models/productModel'
import Order from '../../models/orderModel'

jest.setTimeout(60000)
let user, userAdmin, tokenAdmin, tokenCustomer, newOrder, newProduct
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

describe('Get order', () => {
    beforeAll(async () => {
        await connectDB()
        userAdmin = await User.findOne({ email: 'admin@example.com' })
        tokenAdmin = generateToken(userAdmin._id)
        user = await User.findOne({ email: 'john@example.com' })
        tokenCustomer = generateToken(user._id)
        newProduct = await request(app).post('/api/products/')
            .set('Authorization', `Bearer ${tokenAdmin}`)
        testData.orderItems[0].product = newProduct.body._id
        newOrder = await request(app).post('/api/orders')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send(testData)
    })

    afterAll(async () => {
        await Product.deleteOne({ "_id": `${newProduct.body._id}` })
        await Order.deleteOne({ "_id": `${newOrder.body._id}` })
        await mongoose.disconnect();
        await mongoose.connection.close();
    })

    afterEach(() => {
        app.close()
    })

    it('Should get all orders', async () => {
        const { body, statusCode } = await request(app).get('/api/orders/')
            .set('Authorization', `Bearer ${tokenAdmin}`)
        expect(statusCode).toBe(200)
        expect(body[0]).toHaveProperty("_id")
        expect(body[0]).toHaveProperty("user")
    })

    it('Should get all orders fail with customer role', async () => {
        const { body, statusCode } = await request(app).get('/api/orders/')
            .set('Authorization', `Bearer ${tokenCustomer}`)
        expect(statusCode).toBe(403)
    })

    it('Should get all orders fail when user had not login', async () => {
        const { body, statusCode } = await request(app).get('/api/orders/')
        expect(statusCode).toBe(401)
    })

    it('Should get order by id successfully', async () => {
        const { body, statusCode } = await request(app).get(`/api/orders/${newOrder.body._id}`)
            .set('Authorization', `Bearer ${tokenAdmin}`)
        expect(statusCode).toBe(200)
        expect(body).toHaveProperty("_id")
        expect(body).toHaveProperty("user")
    })

    it('Should get order by id fail when forbidden', async () => {
        const { body, statusCode } = await request(app).get(`/api/orders/${newOrder.body._id}`)
            .set('Authorization', `Bearer ${tokenCustomer}`)
        expect(statusCode).toBe(403)
    })

    it('Should get order by id fail when user had not login', async () => {
        const { body, statusCode } = await request(app).get(`/api/orders/${newOrder.body._id}`)
        expect(statusCode).toBe(401)
    })

    it('Should get list myorder successfully', async() => {
        const { body, statusCode } = await request(app).get('/api/orders/myorders')
            .set('Authorization', `Bearer ${tokenAdmin}`)
        expect(statusCode).toBe(200)
        expect(body[0]).toHaveProperty("_id")
    })

    it('Should get list myorder successfully', async() => {
        const { body, statusCode } = await request(app).get('/api/orders/myorders')
            .set('Authorization', `Bearer ${tokenCustomer}`)
        expect(statusCode).toBe(200)
        expect(body).toHaveLength(0)
    })

})
