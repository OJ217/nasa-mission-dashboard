const { Launch } = require("../../models/launch.schema");

async function httpGetLaunchesCount(req, res) {
    try {
        const launches = (await Launch.find()).length;
        return res.status(200).json(launches);
    } catch (error) {
        return new Error(error);
    }
}

async function httpGetLaunches(req, res) {
    try {
        const query = req.query;

        const limitCount = Math.abs(query.limit) || 20;
        const pageCount = Math.abs(query.page) || 1;
        const skipCount = (pageCount - 1) * limitCount;

        const launches = await Launch.find().sort({ flightNumber: 1 }).skip(skipCount).limit(limitCount);
        return res.status(200).json(launches);
    } catch (error) {
        return new Error(error);
    }
}

async function httpCreateLaunch(req, res) {
    try {
        let launchData = req.body;

        if(!launchData.mission || !launchData.rocket || !launchData.launchDate || !launchData.destination) {
            return res.status(400).json({
                message: "Missing required launch property",
            })
        }

        launchData.launchDate = new Date(launchData.launchDate);

        if(isNaN(launchData.launchDate)) {
            return res.status(400).json({
                message: "Invalid launch date"
            })
        }

        const flightNumber = (await Launch.find().sort("-flightNumber"))[0]?.flightNumber + 1 || 1;

        const launch = await Launch.create({
            mission: launchData.mission,
            rocket: launchData.rocket,
            launchDate: launchData.launchDate,
            destination: launchData.destination,
            customer: launchData.customer,
            flightNumber
        });
        return res.status(201).json(launch);

    } catch (error) {
        return new Error(error)
    }
}

async function httpAbortLaunch(req, res) {
    try {
        let { id } = req.params;

        const launch = await Launch.findOne({flightNumber: id});

        if(!launch) {
            return res.status(400).json({
                message: `Launch with flight number ${id} not found`,
            });
        }

        const abortedLaunch = await Launch.findOneAndUpdate({flightNumber: id}, {upcoming: false, success: false});

        return res.status(200).json({
            message: `Successfully aborted launch ${id}`, 
            abortedLaunch,
        });
    } catch (error) {
        return new Error(error);
    }
}

async function httpLaunchSucceed(req, res) {
    try {
        let { id } = req.params;

        const launch = await Launch.findOne({flightNumber: id});

        if(!launch) {
            return res.status(400).json({
                message: `Launch with flight number ${id} not found`,
            });
        }

        const succeededLaunch = await Launch.findOneAndUpdate({flightNumber: id}, {upcoming: false, success: true});

        return res.status(200).json({
            message: `Successfully aborted launch ${id}`, 
            succeededLaunch,
        });
    } catch (error) {
        return new Error(error);
    }
}

module.exports = {
    httpGetLaunchesCount,
    httpGetLaunches,
    httpCreateLaunch,
    httpAbortLaunch,
    httpLaunchSucceed,
}