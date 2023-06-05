import { it, describe, expect, beforeAll, afterAll } from '@jest/globals';
import supertest, { Response } from 'supertest';
import app from '../../server';



describe("DELETE /contact/[id]", ()=>{
    beforeAll(()=>{
        process.env.NODE_ENV="test";
    })
    afterAll(()=>{
        process.env.NODE_ENV="development";
    })

    it("should return status 200", async()=>{
        const res:Response = await supertest(app)
        .delete("/contact/2");

        expect(res.status).toBe(200);
    })
    it.only("should return status 404", async()=>{
        const res:Response = await supertest(app)
        .delete("/contact/89898");

        expect(res.status).toBe(404);
    })
})