import app, { start } from "../app"
import request from 'supertest'
import config from 'config'
import { sign } from "jsonwebtoken"

describe('profile router tests', () => {
    describe('/ endpoint test', () => {
        //test all the exception before
        test('it should return 41 if no authorization header', async () => {
            await start()
            const result = await request(app).get('/profile')
            expect(result.statusCode).toBe(401)
        })
        test('it should return an array of posts', async () => {
            await start()
            const jwt = sign({ id: '1230ae30-dc4f-4752-bd84-092956f5c633' }, config.get<string>('app.jwtSecret'))
            const result = await request(app)
                .get('/profile')
                .set({ 'Authorization': `Bearer ${jwt}` })
            expect(result.statusCode).toBe(200)
            expect(Array.isArray(result.body)).toBeTruthy()
        })
    })
})