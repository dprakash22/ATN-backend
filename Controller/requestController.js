const { json } = require("express");
const { Request, Sensor } = require("../Models/models.js");
const cron = require("node-cron");
const {getOTA} = require('./OTAcontroller.js')
const moment = require('moment');

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
            const loraID = dataFromAPI.slice(0,1);
            console.log("the lora ID " + loraID);
            const jsonString1 = dataFromAPI.slice(1);
            const jsonString= jsonString1.replace(/\\"/g, '"');

            const jsonData = JSON.parse(jsonString);
            console.log("json Data " + typeof jsonString);

            // const jsonData = JSON.parse(jsonDatas);
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

            console.log(jsonData['1'], "----------------");
            //  new instance of RequestSchema created
            const requestInstance = new Request({
                loraID: loraID,
                userId: "662c8b556b4dc3e02ba28106",
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

const getSensorData = async (req, res) => {
    try {
        var sensordata = req.body;

        const id = sensordata[0];
        const datestring = sensordata.slice(2, 16);
        console.log(datestring)
        const parseDate = moment(datestring, 'YY-MM-DD HH:mm').toDate();

        const lat = sensordata.slice(16, 23);
        const lon = sensordata.slice(24, 31);

        sensordata=sensordata.slice(31)
        console.log(sensordata,"my data is here")

        let dataJson = {};
        
        try {
            const arr = sensordata.split(" ");  // Fixed variable name
            if (id == "5") {
                dataJson['temperature'] = arr[0];
                dataJson['pressure'] = arr[1];
                dataJson['humidity'] = arr[2];
            } else if (id == "2") {
                dataJson['temperature'] = arr[0];
                dataJson['lightIntensity'] = arr[1];
            } else if (id == "4") {
                dataJson['temperature'] = arr[0];
            } else {
                return res.status(500).json({'message': 'Invalid sensor id'});
            }
            console.log(typeof parseDate)
            const sensorInstance = new Sensor({
                'type':id,
                'data':dataJson,
                'date':parseDate.toString(),
                'latitude':lat.trim(),
                'longitude':lon.trim(),
            });
            
            const finalData = await sensorInstance.save()

            console.log('Data saved ',finalData)

            res.status(200).json({
                message: 'Sensor data processed successfully',
            });
        }catch(e){
            console.log(e);
            res.status(500).json({'message':'Error parsing sensor Data','error':e.toString()})
        }
    }
    catch(e){
        console.log(e);
        res.status(500).json({
            "message":"error in collecting data"
        })
    }
}

module.exports = { requestController, requestOutput, getRequest, getSensorData };
