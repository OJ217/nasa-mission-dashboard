const request = require("supertest");
const app = require("../../app");
const { connectDB, disconnectDB } = require("../../config/mongoDbConnection");

describe("Launches API", () => {
    beforeAll(async () => {
        await connectDB();
    });

    afterAll(async () => {
        await disconnectDB();
    })

    describe("Test GET /api/v1/launches", ()=>{
        test("status code is 200 and content-type includes json format", async () => { 
            const response = await request(app).get("/api/v1/launches");
            expect(response.statusCode).toBe(200);
            expect(response.type).toMatch(/json/);
        });
    });
    
    describe("Test POST /api/v1/launches", ()=>{
        const completeLaunchData = {
            mission: "Kepler Exploration X",
            rocket: " Explorer IS1",
            launchDate: "December 25, 2032",
            destination: "Kepler 442 B",
        }
    
        const incompleteLaunchData = {
            mission: "Kepler Exploration X",
            rocket: " Explorer IS1",
            destination: "Kepler 442 B",
        }
    
        const launchDataInvalidDate = {
            mission: "Kepler Exploration X",
            rocket: " Explorer IS1",
            launchDate: "Hello, World!",
            destination: "Kepler 442 B",
        }
    
        test("Status code is 201, content-type includes json format and equal request and response data", async () => { 
            const response = await request(app)
                .post("/api/v1/launches")
                .send(completeLaunchData);
            expect(response.statusCode).toBe(201);
            expect(response.type).toMatch(/json/);
    
            const requestLaunchDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseLaunchDate = new Date(response.body.launchDate).valueOf();
    
            expect(requestLaunchDate).toBe(responseLaunchDate);
    
            expect(response.body).toMatchObject(incompleteLaunchData);
        });
    
        test("Throw error when missing required properties", async () => {
            const response = await request(app)
                .post("/api/v1/launches")
                .send(incompleteLaunchData);
            expect(response.statusCode).toBe(400);
            expect(response.body).toStrictEqual({
                message: "Missing required launch property",
            })
        });
    
        test("Throw error when submitting invalid launch date", async () => {
            const response = await request(app)
                .post("/api/v1/launches")
                .send(launchDataInvalidDate);
            expect(response.statusCode).toBe(400);
            expect(response.body).toStrictEqual({
                message: "Invalid launch date",
            })
        })
    });
})