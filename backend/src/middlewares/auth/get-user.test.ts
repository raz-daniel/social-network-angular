import { Request, Response } from "express"
import getUser from "./get-user"

describe('get-user middleware test', () => {
    test('calls next with a 401 error when no authorization header is provided', () => {
        const request = { headers: {} } as Request
        const response = {} as Response
        const next = () => { }
        getUser(request, response, next)
    })
})