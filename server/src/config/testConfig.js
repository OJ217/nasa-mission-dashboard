const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

async function createServer() {
    return await MongoMemoryServer.create();
}

const mongod = createServer();

async function connectDB() {
    await mongoose.connect((await mongod).getUri());
    console.log("connectDB");
}

async function disconnectDB() {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    (await mongod).stop()
    console.log("disconnectDB");
}

async function clearDB() {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        collections[key].deleteMany();
    }
}

module.exports = { connectDB, disconnectDB, clearDB };