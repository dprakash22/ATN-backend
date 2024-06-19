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

// const getRequest = async (req, res) => {
//     try {
//         console.log(req.body);

//         const dataFromAPI = req.body;
//         // console.log(JSON.parse(dataFromAPI));
//         // // var
//         // // console.log(
//         // //     JSON.parse()
//         // // );

//         if (typeof dataFromAPI === "string" && dataFromAPI.trim().length > 1 && dataFromAPI.trim().charAt(1) === '{') {

//             const loraID = dataFromAPI.charAt(0);
//             console.log("the lora ID " + loraID);

//             const jsonPart = dataFromAPI.slice(1).trim();
            
//             const jsonData = JSON.parse(jsonPart);

//             if(jsonData["0"]){
//                 let completemsg = await Request.find({
//                     _id:jsonData['0']
//                 })
//                 completemsg.status="Completed"
//                 await completemsg.save()
//             }

//             // need to insert userID
//             else{
//             const userId = jsonData.i;
//             const x = {};

//             console.log(jsonData.f, "----------------");
//             //  new instance of RequestSchema created
//             const requestInstance = new Request({
//                 loraID: loraID,
//                 userId: userId,
//                 data: jsonData,
//             });

//             // Save the instance to the database
//             const savedRequest = await requestInstance.save();

//             console.log("Request saved:", savedRequest);
//             res.status(200).json({
//                 data_send: req.body,
//                 message: "Request saved successfully",
//             });
//         }} else {
//             res.status(400).json({ message: "Invalid data format" });
//         }
//     } catch (error) {
//         console.error("Error Occurred:", error);
//         res.status(500).json({
//             message: "Error saving request",
//             " Error": error,
//         });
//     }
// };
const getRequest = async (req, res) => {
    try {
        console.log("Incoming data:", req.body);

        const dataFromAPI = req.body;
        console.log(dataFromAPI.charAt(1))

        // Check if the data from API is a string and has the expected format
        if (dataFromAPI.length > 1 && dataFromAPI.charAt(1) === '{') {
            // Extract the loraID which is the first character
            const loraID = dataFromAPI.charAt(0);
            console.log("The lora ID: " + loraID);

            // Extract the JSON part
            const jsonPart = dataFromAPI.slice(1); // Remove the first character

            // Replace any escaped double quotes in the JSON part
            const jsonString = jsonPart.replace(/\\"/g, '"');

            // Parse the JSON part
            let jsonData;
            try {
                jsonData = JSON.parse(jsonString);
            } catch (parseError) {
                console.error("Error parsing JSON:", parseError);
                throw new Error("Invalid JSON format");
            }

            // Example: Handle jsonData based on your logic
            if (jsonData.hasOwnProperty('1') && jsonData.hasOwnProperty('1')) {
                console.log("Fields f and w:", jsonData.f, jsonData.w);
                // Assuming you want to proceed with further logic based on 'f' and 'w'
            } else {
                console.log("Invalid JSON structure:", jsonData);
                throw new Error("Invalid JSON structure");
            }

            // Example: Respond with success message
            res.status(200).json({
                data_received: req.body,
                message: "Data processed successfully",
            });
        } else {
            console.log("Invalid data format:", dataFromAPI);
            res.status(400).json({ message: "Invalid data format" });
        }
    } catch (error) {
        console.error("Error Occurred:", error);
        res.status(500).json({
            message: "Error processing request",
            error: error.toString(),
        });
    }
};

module.exports = { requestController, requestOutput, getRequest };
