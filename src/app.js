const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const { User, LoRa, Reqest } = require("./Models/models");
const mongoose = require("mongoose");
const { controllerApp } = require("./router/routes.js");

const app = express();
app.use(bodyParser.json());
app.use(express.text())

app.use(cors());
app.use(express.json());
app.use("/user", controllerApp);

app.get("/try_msg", async (req, res) => {
    try {
        res.status(200).json({
            message: "Verified",
        });
        console.log("joi");
    } catch (e) {
        console.log(e);
        res.status(500).json({
            Message: "False",
        });
    }
});


//'172.16.126.92'
app.listen(8000, async () => {
    console.log("listening at 8000...");
    try {
        await mongoose.connect(
            "mongodb+srv://dprakash22:Dprakash2004@cluster.uz0duh9.mongodb.net/ATNprojectDB?retryWrites=true&w=majority&appName=Cluster"
        );
        console.log("connected to db");
    } catch (e) {
        console.log(e);
        console.log("coundn't establish connection....")
    }
});
