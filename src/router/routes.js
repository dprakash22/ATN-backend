const { userController, loginpage } = require("../Controller/userController");
const {
    requestController,
    requestOutput,
} = require("../Controller/requestController");
const express = require("express");
const { getUserDetails } = require("../Controller/loraController");

const controllerApp = express.Router();

// User routes
controllerApp.post("/detail", userController);
controllerApp.post("/login", loginpage);

// Request Routes
controllerApp.post("/newRequesting", requestController);
controllerApp.get("/allRequests", requestOutput);

// LoRa Routes
controllerApp.post("/getUserDetails", getUserDetails);

module.exports = { controllerApp };
