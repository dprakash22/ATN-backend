const { userController, loginpage } = require("../Controller/userController");
const {
    requestController,
    requestOutput,
} = require("../Controller/requestController");
const express = require("express");

const controllerApp = express.Router();

controllerApp.post("/detail", userController);
controllerApp.post("/login", loginpage);

controllerApp.post("/newRequesting", requestController);
controllerApp.get("/allRequests", requestOutput);

module.exports = { controllerApp };
