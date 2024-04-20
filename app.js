const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());

app.get("/try_msg", async (req, res) => {
    try {
        res.status(200).json({
            message: "Verified",
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            Message: "False",
        });
    }
});

app.listen(8000, async () => {
    console.log("listening at 8000...");
    try {
        await mongoose.connect(
            "mongodb+srv://dprakash22:Dprakash2004@cluster.uz0duh9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster"
        );
        console.log("connected to db");
    } catch (e) {
        console.log(e);
        console.log("coundn't establish connection....");
    }
});
