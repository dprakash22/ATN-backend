const {userController,loginpage} =require("../Controller/userController");
const express = require("express");

const userControllerapp = express.Router();


userControllerapp.post('/detail',userController);
userControllerapp.post('/login',loginpage)

module.exports={userControllerapp}