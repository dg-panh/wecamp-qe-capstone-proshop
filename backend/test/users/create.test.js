import mongoose from "mongoose"
import app from '../../server'
import connectDB from '../../config/db'
import User from '../../models/userModel'
const request = require('supertest')

describe('Get all products', () => {
    jest.setTimeout(60000);
    beforeAll(async() => { await connectDB() })

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    })

    beforeEach(() => {
        // req = supertest(app)
    })

    afterEach(() => {
        app.close()
    })

    it('Should create a new account', async () => {
        let account = {
            'name': 'Panh',
            'email': 'Panh123@gmail.com',
            'password': '123',
        }
        const { statusCode } = await request(app).post('/api/users/').send(account)
        expect(statusCode).toBe(201)
        await User.deleteOne({"email": `${account.email}`})
    })

    it('Should get product by id', async() => {
        const { statusCode } = await request(app).get('/api/products/62d18d53b069ba594ce41b56')
        expect(statusCode).toBe(200)
    })
})