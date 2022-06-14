const request = require("supertest");
const app = require("../../app");
const { connectDB, disconnectDB, clearDB } = require("../../config/testConfig");

describe("Planets API", () => {
    beforeAll(connectDB);
    afterEach(clearDB);
    afterAll(disconnectDB);

    describe("Test GET /api/v1/planets", ()=>{
        test("status code is 200 and content-type includes json format", async () => { 
            const response = await request(app).get("/api/v1/planets");
            expect(response.statusCode).toBe(200);
            expect(response.type).toMatch(/json/);
        });
    })
})