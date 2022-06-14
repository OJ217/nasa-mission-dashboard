const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config({path: path.resolve(__dirname, "../../.env")});

const api = require("./routes/api");

const app = express();
const { NODE_ENV } = process.env;

if(NODE_ENV == "DEVELOPMENT") {
    app.use(cors({ origin: "http://localhost:3000" }));
}

app.use(morgan("combined"));
app.use(express.json());

app.use("/api/v1", api);

if(NODE_ENV == "PRODUCTION") {
    app.get("/launch", (req, res) => {
        res.sendFile(path.join(__dirname, "..", "public", "index.html"));
    });
    app.use(express.static(path.join(__dirname, "..", "public")));
}

module.exports = app;