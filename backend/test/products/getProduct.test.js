import mongoose from "mongoose"
import app from '../../server'
import connectDB from '../../config/db'
const request = require('supertest')

jest.setTimeout(60000)

describe('Get all products', () => {
    beforeAll(async() => { await connectDB() })

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    })

    afterEach(() => {
        app.close()
    })

    it('Should get all products', async() => {
        const { body, statusCode } = await request(app).get('/api/products')
        expect(statusCode).toBe(200)
        expect(body.products[0]).toHaveProperty('_id')
        expect(body.products[0]).toHaveProperty('name')
        expect(body.products[0]).toHaveProperty('countInStock')
        expect(body.products[0]).toHaveProperty('image')
        expect(body.products[0]).toHaveProperty('price')
    })
})

describe('Get product by id', () => {
    beforeAll(async() => { await connectDB() })

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    })

    afterEach(() => {
        app.close()
    })

    let productId

    it('Should get product by id', async() => {
        productId = '62d18d53b069ba594ce41b56'
        const { body, statusCode } = await request(app).get(`/api/products/${productId}`)
        expect(statusCode).toBe(200)
        expect(body).toHaveProperty('_id')
        expect(body).toHaveProperty('name')
        expect(body).toHaveProperty('countInStock')
        expect(body).toHaveProperty('image')
        expect(body).toHaveProperty('price')
    })

    it('Should not get a product by wrong id', async() => {
        productId = '62d18d53b066ba594ce41b56'
        const { body, statusCode } = await request(app).get(`/api/products/${productId}`)
        expect(statusCode).toBe(404)
        expect(body.message).toBe('Product not found')
    })
})