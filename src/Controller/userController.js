const { User } = require("../Models/models.js");
const mongoose = require("mongoose");

const userController=async(req,res)=>{
    try{
        const a= await User.create({
            "fname":req.body.fname,
            "lname":req.body.lname,
            "email":req.body.email,
            "mobile":req.body.mobile,
            "address":req.body.address,
            "password":req.body.password
        })
        console.log(a)
        res.status(200).json({
            status: "Successfully created",
        });
    }catch(error){
        console.log(error)
        res.status(200).json({
            "status":"failed to create",
            "error":error
        })
        }
}


const loginpage = async (req, res) => {
    if (req.body.username == "" || req.body.password == "") {
        res.status(200).json({
            status: "fill the fields",
        });
    }
    try {
        const filter = { email: req.body.email, password: req.body.password };
        const email = filter.email;
        const verify = await User.findOne({ email: email });
        if (verify != [] && verify.password == filter.password) {
            res.status(200).json({
                status: "correct and login successfully",
                data: true,
            });
        } else {
            console.log("not success");
            res.status(500).json({
                data: false,
                status: "failed",
            });
        }
    } catch (err) {
        res.status(500).json({
            status: "failed to login",
        });
    }
};

// const getData = async(req,res)=>{
//     try{
//         const x =req.body
//         console.log(x)        
//     }catch(err){
//         console.log(err)
//     }   
// }


const getData = async (req, res) => {
    try {
        console.log(req.body);

        const dataFromAPI = req.body;
        // var
        // console.log( 
        //     JSON.parse()
        // );

        if (typeof dataFromAPI === "string") {
            const loraID = dataFromAPI.slice(1, 7);
            console.log("the lora ID " + loraID);
            const jsonString = dataFromAPI.slice(7).trim();
            console.log("json Data" + jsonString);

            // const jsonData = JSON.parse(jsonString);
            const jsonData = JSON.parse(dataFromAPI.replace(/'/g, '"'));
            console.log(typeof jsonData);
            // nedd to insert userID
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
        } else {
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

const particularData = async (req, res) => {
    try {
        const persons = await User.findById(req.body.userID);

        res.status(200).json(persons);
    } catch (err) {
        res.status(500).json({
            Message: "Some Error has Occured",
            Error: err,
        });
    }
};

module.exports = { userController, loginpage, particularData,getData };
