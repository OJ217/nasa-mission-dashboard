const http = require("http");
const app = require("./app");
const { connectDB } = require("./config/mongoDbConnection");
 
const server = http.createServer(app); 
const PORT = process.env.PORT || 8000;

const { loadPlanetsData, loadLaunchesData } = require("./config/loadData");

async function startServer() {
    await connectDB();

    await loadPlanetsData();
    await loadLaunchesData();

    server.listen(PORT, () => {
        console.log("\x1b[33m%s\x1b[0m", `Server running on PORT ${PORT}`);
    });
}

startServer();