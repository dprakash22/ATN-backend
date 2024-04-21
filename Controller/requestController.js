const { Request } = require("../Models/models.js");
const cron = require("node-cron");

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
        console.log("Enter into try block of requestOutput");

        const requestPage = await Request.find({ status: { $ne: "Expired" } });

        res.status(200).json({
            Message: "Successfully the required data has been displayed",
            data: requestPage,
        });
    } catch (e) {
        console.log("Entered into error block ......");
        res.status(500).json({
            Message: "Error occured",
            Error: e,
        });
    }
};

//upto now all values can be get from this api
module.exports = { requestController, requestOutput };
