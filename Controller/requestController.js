const { json } = require("express");
const { Request, Sensor } = require("../Models/models.js");
const cron = require("node-cron");
const {getOTA} = require('./OTAcontroller.js')
const moment = require('moment-timezone');


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
        console.log(req.body,'-----------');

        const dataFromAPI = req.body;
        // console.log(JSON.parse(dataFromAPI));
        // // var
        // // console.log(
        // //     JSON.parse()
        // // );

        if (typeof dataFromAPI === "string") {
            const loraID = dataFromAPI.slice(0,1);
            console.log("the lora ID " + loraID);
            const jsonString1 = dataFromAPI.slice(2);
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
        // Extract the sensor data from the request body
        const sensordata = req.body;

        // Ensure data is a string
        if (typeof sensordata !== 'string') {
            return res.status(400).json({'message': 'Invalid sensor data format'});
        }

        // Split the data string by spaces
        const dataParts = sensordata.split(' ');

        // Extract data
        const id = dataParts[0];
        const dateStr = dataParts.slice(1, 3).join(' '); // Combine date and time
        const lat = dataParts[3];
        const lon = dataParts[4];
        const readings = dataParts.slice(5); // Remaining sensor readings

        // Parse the date string
        const parseDate = moment(dateStr, 'YY-MM-DD HH:mm').tz('Asia/Kolkata', true).toDate();
        console.log(dateStr);
        console.log(typeof(dateStr));
        console.log(parseDate);
        console.log(typeof(parseDate));


        // Build data JSON based on sensor ID
        let dataJson = {};
        if (id === "5") {
            dataJson['temperature'] = readings[0];
            dataJson['pressure'] = readings[1];
            dataJson['humidity'] = readings[2];
        } else if (id === "2") {
            dataJson['temperature'] = readings[0];
            dataJson['lightIntensity'] = readings[1];
        } else if (id === "4") {
            dataJson['temperature'] = readings[0];
        } else {
            return res.status(400).json({'message': 'Invalid sensor id'});
        }

        // Create a new Sensor instance
        const sensorInstance = new Sensor({
            'type': id,
            'data': dataJson,
            'date': moment(parseDate).toISOString(), // Save in ISO format
            'latitude': lat,
            'longitude': lon,
        });

        // Save the instance to the database
        const finalData = await sensorInstance.save();

        console.log('Data saved ', finalData);

        res.status(200).json({
            message: 'Sensor data processed successfully',
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({'message': 'Error processing sensor data', 'error': e.toString()});
    }
};


const sendToQGIS = async (req, res) => {
    try {
        console.log('In send to QGIS...');

        // Retrieve recent sensor entries from the database
        const recentEntries = await Sensor.aggregate([
            { $sort: { type: 1, date: -1 } },
            {
                $group: {
                    _id: "$type",
                    type: { $first: "$type" },
                    data: { $first: "$data" },
                    date: { $first: "$date" }
                }
            },
            { $sort: { type: 1 } }
        ]);

        let status = {};

        // Process each entry
        recentEntries.forEach((val) => {
            // Convert the date field from the database to a moment object in UTC
            const specificDate = moment.utc(val.date);
            // Get the current date in UTC
            const currentDate = moment.utc();

            console.log(specificDate.toISOString(), " ", currentDate.toISOString());

            // Calculate the difference in minutes
            const differenceInMinutes = currentDate.diff(specificDate, 'minutes');

            // Determine status based on time difference in minutes
            if (differenceInMinutes >= 1) { // 60 minutes = 1 hour
                status[val.type] = 0;
            } else {
                status[val.type] = 1;
            }

            console.log(`${val.type}: ${differenceInMinutes} minutes ago, status: ${status[val.type]}`);
        });

        console.log('Recent entries:', recentEntries);
        return res.status(200).json({ 'message': "Data sent successfully", 'data': status });
    } catch (e) {
        console.error('Error in sendToQGIS:', e);
        return res.status(500).json({ 'message': 'Internal server error' });
    }
};


module.exports = { requestController, requestOutput, getRequest, getSensorData ,sendToQGIS};
