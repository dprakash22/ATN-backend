const { json } = require("express");
const { Request } = require("../Models/models.js");
const cron = require("node-cron");
const {getOTA} = require('./OTAcontroller.js')

// here only cron implementation started

const updateRequestStatus = async () => {
    try {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const requestsToUpdate = await Request.find({
            status: "Not Completed",
            createdAt: { $lt: twentyFourHoursAgo },
        });

        for (const request of requestsToUpdate) {
            request.status = "Expired";
            await request.save();
        }

        console.log("Request statuses updated successfully");
    } catch (error) {
        console.error("Error updating request statuses:", error);
    }
};

cron.schedule("0 * * * *", updateRequestStatus);

// implementation completed....

const requestController = async (req, res) => {
    console.log("hellloo");
    try {
        const needHelp = await Request.create({
            data: req.body.data,
            status: "Not Completed",
            loraID: req.body.loraID,
        });

        console.log(needHelp);

        res.status(200).json({
            Status: "Sucessfully new request has created",
        });
    } catch (e) {
        res.status(500).json({
            Status: "Request did not created",
            Message: e,
        });
    }
};

const requestOutput = async (req, res) => {
    try {
        console.log("Enter into try block of requestOutput 1 ");

        const requestPage = await Request.find({ status: { $ne: "Expired" } });
        const ota =  await getOTA()
        res.status(200).json({
            Message: "Successfully the required data has been displayed",
            data: requestPage,
            OTA: {
                version : ota.version
            }
        });
    } catch (e) {
        console.log("Entered into error block ......");
        res.status(500).json({
            Message: "Error occured",
            Error: e,
        });
    }
};

const getRequest = async (req, res) => {
    try {
        console.log(req.body);

        const dataFromAPI = req.body;
        // console.log(JSON.parse(dataFromAPI));
        // // var
        // // console.log(
        // //     JSON.parse()
        // // );

        if (typeof dataFromAPI === "string") {
            const loraID = dataFromAPI.slice(1, 7);
            console.log("the lora ID " + loraID);
            const jsonString = '"' + dataFromAPI.slice(7).trim();
            console.log("json Data" + jsonString);

            const jsonDatas = JSON.parse(jsonString);
            const jsonData = JSON.parse(jsonDatas);
            console.log(typeof jsonData);

            if(jsonData["0"]){
                let completemsg = await Request.find({
                    _id:jsonData['0']
                })
                completemsg.status="Completed"
                await completemsg.save()
            }

            // need to insert userID
            else{
            const userId = jsonData.i;
            const x = {};

            console.log(jsonData.f, "----------------");
            //  new instance of RequestSchema created
            const requestInstance = new Request({
                loraID: loraID,
                userId: userId,
                data: jsonData,
            });

            // Save the instance to the database
            const savedRequest = await requestInstance.save();

            console.log("Request saved:", savedRequest);
            res.status(200).json({
                data_send: req.body,
                message: "Request saved successfully",
            });
        }} else {
            res.status(400).json({ message: "Invalid data format" });
        }
    } catch (error) {
        console.error("Error Occurred:", error);
        res.status(500).json({
            message: "Error saving request",
            " Error": error,
        });
    }
};

module.exports = { requestController, requestOutput, getRequest };
