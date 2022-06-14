const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");
const axios = require("axios");
const { Planet } = require("../models/planet.schema");
const { Launch } = require("../models/launch.schema");
const mongoose = require("mongoose");

function isHabitablePlanet(planet){
    return planet["koi_disposition"] === "CONFIRMED" && (planet["koi_insol"] > 0.36 && planet["koi_insol"] < 1.11) && planet["koi_prad"] < 1.6;
}

async function collectionExists(collectionName) {
    const collectionNames = (await mongoose.connection.db.listCollections().toArray()).flatMap(collection => collection.name);
    return collectionNames.includes(String(collectionName));
}

async function loadPlanetsData() {
    const planetsCollectionExists = await collectionExists("planets");
    const planetsDocumentExists = (await Planet.find()).length > 0;

    if(planetsCollectionExists && planetsDocumentExists) {
        console.log("\x1b[31m", `Planets data already loaded`);
        return null;
    }

    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, "..", "..", "data", "kepler_data.csv"))
            .pipe(parse({
                comment: "#",
                columns: true
            }))
            .on("data", async (data)=>{
                if(isHabitablePlanet(data)) {
                    await Planet.updateOne({
                        keplerName: data.kepler_name,
                    }, {
                        keplerName: data.kepler_name,
                    }, {
                        upsert: true
                    })
                };
            })
            .on("error", (error)=>{
                console.log(error);
                reject(error);
            })
            .on("end", async ()=>{
                const habitablePlanets = (await Planet.find()).length;
                console.log("\x1b[33m%s\x1b[0m", `Done parsing kepler_data.csv file and found ${habitablePlanets} habitable planets:`);
                resolve();
            });
    });
}

const SPACE_X_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function loadLaunchesData() {
    const spaceXLaunchesExists = await Launch.findOne({dataSource: "space-x"});

    if(spaceXLaunchesExists) {
        console.log("\x1b[31m", `SpaceX launches data already loaded`);
        return null;
    }

    const response = await axios.post(SPACE_X_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: "rocket",
                    select: {
                        name: 1
                    }
                }, 
                {
                    path: "payloads",
                    select: {
                        customers: 1
                    }
                }
            ]
        }
    });

    const launchDocs = response.data.docs;

    for (const launchDoc of launchDocs) {
        const payloads = launchDoc["payloads"];
        const customer = payloads.flatMap(payload => payload["customers"]);

        const launch = {
            flightNumber: launchDoc["flight_number"],
            mission: launchDoc["name"],
            rocket: launchDoc["rocket"]["name"],
            launchDate: launchDoc["date_local"],
            upcoming: launchDoc["upcoming"],
            success: launchDoc["success"],
            dataSource: "space-x",
            customer
        };

        try {
            await Launch.create(launch);
        } catch (error) {
            return new Error(error);
        }
    }
}

module.exports = { loadPlanetsData, loadLaunchesData };