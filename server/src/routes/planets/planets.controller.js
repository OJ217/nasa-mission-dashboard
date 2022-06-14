const { Planet } = require("../../models/planet.schema")

async function httpGetPlanets(req, res) {
    try {
        const planets = await Planet.find();
        return res.status(200).json(planets);
    } catch (error) {
        return new Error(error);
    }
}

module.exports = {
    httpGetPlanets,
}