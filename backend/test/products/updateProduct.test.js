import mongoose from "mongoose"
import app from '../../server'
import connectDB from '../../config/db'
const request = require('supertest')
import generateToken from '../../utils/generateToken'
import User from '../../models/userModel'
import Product from '../../models/productModel'
import testData from '../testData.json'

jest.setTimeout(60000)
let userAdmin, tokenAdmin, data, userCus, tokenCus

describe('Update Product', () => {
    beforeAll(async () => {
        await connectDB()
        userAdmin = await User.findOne({ email: 'admin@example.com' })
        tokenAdmin = generateToken(userAdmin._id)
        userCus = await User.findOne({ email: 'panh@gmail.com' })
        tokenCus = generateToken(userCus._id)
        data = {
            "name": "Test Product",
            "image": "upload/test",
            "brand": "Test Brand",
            "category": "Test Category",
            "description": "Test Description",
            "price": 10000,
            "countInStock": 100
        }
    })

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    })

    afterEach(() => {
        app.close()
    })

    it('Should update product successfully with valid data', async () => {
        const newProduct = await request(app).post('/api/products/')
            .set('Authorization', `Bearer ${tokenAdmin}`)
        const { body, statusCode } = await request(app).put(`/api/products/${newProduct.body._id}`)
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send(data)
        expect(statusCode).toBe(200)
        expect(body).toMatchObject(data)
        await Product.deleteOne({ "_id": `${body._id}` })
    })

    it('Should update product fail with wrong product id', async () => {
        const wrongID = '62ef3d72b3abc90d9850b23d'
        const { body, statusCode } = await request(app).put(`/api/products/${wrongID}`)
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send(data)
        expect(statusCode).toBe(404)
        expect(body.message).toBe('Product not found')
    })

    it('Should update product fail as a customer', async() => {
        const newProduct = await request(app).post('/api/products/')
            .set('Authorization', `Bearer ${tokenAdmin}`)
        const { statusCode } = await request(app).put(`/api/products/${newProduct.body._id}`)
            .set('Authorization', `Bearer ${tokenCus}`)
            .send(data)
        expect(statusCode).toBe(403)
    })

    it('Should update product fail when unauthorized', async() => {
        const newProduct = await request(app).post('/api/products/')
            .set('Authorization', `Bearer ${tokenAdmin}`)
        const { statusCode } = await request(app).put(`/api/products/${newProduct.body._id}`)
            .send(data)
        expect(statusCode).toBe(401)
    })

    describe('Update product that lacks the required field', () => {
        it('Should update fail due to lack of product name', async () => {
            data.name = ''
            const newProduct = await request(app).post('/api/products/')
                .set('Authorization', `Bearer ${tokenAdmin}`)
            const { body, statusCode } = await request(app).put(`/api/products/${newProduct.body._id}`)
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send(data)
            expect(statusCode).toBe(400)
            await Product.deleteOne({ "_id": `${newProduct.body._id}` })
        })

        it('Should update fail due to lack of price', async () => {
            data.price = ''
            const newProduct = await request(app).post('/api/products/')
                .set('Authorization', `Bearer ${tokenAdmin}`)
            const { body, statusCode } = await request(app).put(`/api/products/${newProduct.body._id}`)
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send(data)
            expect(statusCode).toBe(400)
            await Product.deleteOne({ "_id": `${newProduct.body._id}` })
        })

        it('Should update fail due to lack of description', async () => {
            data.description = ''
            const newProduct = await request(app).post('/api/products/')
                .set('Authorization', `Bearer ${tokenAdmin}`)
            const { body, statusCode } = await request(app).put(`/api/products/${newProduct.body._id}`)
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send(data)
            expect(statusCode).toBe(400)
            await Product.deleteOne({ "_id": `${newProduct.body._id}` })
        })

        it('Should update fail due to lack of image', async () => {
            data.image = ''
            const newProduct = await request(app).post('/api/products/')
                .set('Authorization', `Bearer ${tokenAdmin}`)
            const { body, statusCode } = await request(app).put(`/api/products/${newProduct.body._id}`)
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send(data)
            expect(statusCode).toBe(400)
            await Product.deleteOne({ "_id": `${newProduct.body._id}` })
        })

        it('Should update fail due to lack of brand', async () => {
            data.brand = ''
            const newProduct = await request(app).post('/api/products/')
                .set('Authorization', `Bearer ${tokenAdmin}`)
            const { body, statusCode } = await request(app).put(`/api/products/${newProduct.body._id}`)
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send(data)
            expect(statusCode).toBe(400)
            await Product.deleteOne({ "_id": `${newProduct.body._id}` })
        })

        it('Should update fail due to lack of brand', async () => {
            data.category = ''
            const newProduct = await request(app).post('/api/products/')
                .set('Authorization', `Bearer ${tokenAdmin}`)
            const { body, statusCode } = await request(app).put(`/api/products/${newProduct.body._id}`)
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send(data)
            expect(statusCode).toBe(400)
            await Product.deleteOne({ "_id": `${newProduct.body._id}` })
        })

        it('Should update fail due to lack of count in stock', async () => {
            data.countInStock = ''
            const newProduct = await request(app).post('/api/products/')
                .set('Authorization', `Bearer ${tokenAdmin}`)
            const { body, statusCode } = await request(app).put(`/api/products/${newProduct.body._id}`)
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send(data)
            expect(statusCode).toBe(400)
            await Product.deleteOne({ "_id": `${newProduct.body._id}` })
        })
    })

    describe('Update product that duplicate fields', () => {
        it('Should update successfully when duplicate product name with other product', async () => {
            data.name = 'Duplicate Name'
            //create first product
            const firstProduct = await request(app).post('/api/products/')
                .set('Authorization', `Bearer ${tokenAdmin}`)
            await request(app).put(`/api/products/${firstProduct.body._id}`)
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send(data)

            //create second product
            const secondProduct = await request(app).post('/api/products/')
                .set('Authorization', `Bearer ${tokenAdmin}`)
            const { body, statusCode } = await request(app).put(`/api/products/${secondProduct.body._id}`)
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send(data)
            expect(statusCode).toBe(200)
            expect(body).toMatchObject(data)
            await Product.deleteOne({ "_id": `${firstProduct.body._id}` })
            await Product.deleteOne({ "_id": `${secondProduct.body._id}` })
        })
    })
})