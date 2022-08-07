import mongoose from "mongoose"
import app from '../../server'
import connectDB from '../../config/db'
const request = require('supertest')
import generateToken from '../../utils/generateToken'
import User from '../../models/userModel'
import Product from '../../models/productModel'

jest.setTimeout(60000)
let user, userAdmin, tokenAdmin, testData, tokenCustomer

describe('Create Product', () => {
    beforeAll(async() => {
        await connectDB()
        userAdmin = await User.findOne({ email: 'admin@example.com' })
        tokenAdmin = generateToken(userAdmin._id)
        user = await User.findOne({ email: 'panh@gmail.com' })
        tokenCustomer = generateToken(user._id)
        testData = {
            'user': `${user._id}`,
            'name': 'Sample name',
            'image': '/images/sample.jpg',
            'brand': 'Sample brand',
            'category': 'Sample category',
            'description': 'Sample description',
            'price': 0,
            'countInStock': 0,
            'numReviews': 0
        }
    })

    afterAll(async() => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    })

    afterEach(() => {
        app.close()
    })

    it('Should create product successfully with valid data', async () => {
        const { body, statusCode } = await request(app).post('/api/products/')
            .set('Authorization', `Bearer ${tokenAdmin}`)
        expect(statusCode).toBe(201)
        expect(body).toMatchObject(testData)
        await Product.deleteOne({ "_id": `${body._id}` })
    })

    it('Should create product fail as a customer', async() => {
        const { statusCode } = await request(app).post('/api/products/')
            .set('Authorization', `Bearer ${tokenCustomer}`)
        expect(statusCode).toBe(403) //403 Forbidden      
    })

    it('Should create product fail when unauthorized', async() => {
        const { statusCode } = await request(app).post('/api/products/')
        expect(statusCode).toBe(401)
    })
})