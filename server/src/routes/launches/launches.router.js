const express = require("express");
const { httpGetLaunchesCount, httpGetLaunches, httpCreateLaunch, httpAbortLaunch, httpLaunchSucceed } = require("./launches.controller");

const launchesRouter = express.Router();

launchesRouter.get("/", httpGetLaunches);
launchesRouter.get("/pagination-count", httpGetLaunchesCount);
launchesRouter.post("/", httpCreateLaunch);
launchesRouter.put("/abort/:id", httpAbortLaunch);
launchesRouter.put("/succeed/:id", httpLaunchSucceed);

module.exports = launchesRouter;