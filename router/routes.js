const {
    userController,
    loginpage,
    particularData,
    getData
} = require("../Controller/userController");
const {
    requestController,
    requestOutput,
    getRequest,
    getSensorData,
    sendToQGIS
} = require("../Controller/requestController");
const {
    getOTAcode,
    getOTAversion
} = require('../Controller/OTAcontroller')
const express = require("express");
const { getUserDetails } = require("../Controller/loraController");

const controllerApp = express.Router();

// User routes
// controllerApp.post("/", getData);
controllerApp.post("/detail", userController);
controllerApp.post("/login", loginpage);
controllerApp.post("/allUsers", particularData);

// Request Routes
controllerApp.post("/newRequesting", requestController);
controllerApp.get("/allRequests", requestOutput);
controllerApp.post("/lorasend", getRequest);
controllerApp.post("/lorasensor",getSensorData);
controllerApp.get("/sensorqgis",sendToQGIS)

// LoRa Routes
controllerApp.post("/getUserDetails", getUserDetails);

// OTA routes
controllerApp.get('/versionNumber', getOTAversion);
controllerApp.get('/code',getOTAcode);

module.exports = { controllerApp };
