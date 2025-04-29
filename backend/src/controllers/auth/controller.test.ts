import { v4 } from "uuid";
import { hashPassword } from "./controller";

describe('hashPassword tests', () => {
    test('generates password that is valid sha256 output', () => {
        const result = hashPassword(v4())
        expect(result).toBeDefined()
        expect(result.length).toBe(64)
    })
    test('generates the same hashed password for identical input', () => {
        const input = v4()
        const hash1 = hashPassword(input)
        const hash2 = hashPassword(input)
        expect(hash1).toEqual(hash2)
    })
    test('generates different hashed password for different input', () => {
        const input1 = v4()
        const input2 = v4()
        const hash1 = hashPassword(input1)
        const hash2 = hashPassword(input2)
        expect(hash1).not.toEqual(hash2)
    })
    test('generates a given hash from a given password + secret', () => {
        const hash = hashPassword('123456')
        expect(hash).toBe('7f7737fddd2842bc2afdbf1868aaa8e986b83133a1f010fe96535c15e4584628')
    })
})
