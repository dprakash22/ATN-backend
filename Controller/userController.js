const { User } = require("../Models/models.js");
const mongoose = require("mongoose");

const userController = async (req, res) => {
    try {

            const a = await User.create({
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
                mobile: req.body.mobile,
                password: req.body.password,
                address: req.body.address
            });
            console.log(a);
            res.status(200).json({
                status: "successfully created",
            });
       
    } catch (error) {
        console.log(error);
        res.status(200).json({
            status: "failed to create",
            error: error,
        });
    }
};


const loginpage = async (req, res) => {
    if (req.body.email == "" || req.body.password == "") {
        res.status(200).json({
            status: "fill the fields",
        });
    }
    try {
        console.log(typeof req.body)
        const filter = { email: req.body.email, password: req.body.password };
        const email = filter.email;
        const verify = await User.findOne({ email: email });
        if (verify != [] && verify.password == filter.password) {
            res.status(200).json({
                status: "correct and login successfully",
                data: true,
                id:verify._id,
                name:verify.fname+" "+verify.lname,
            });
        } else {
            console.log("not success");
            res.status(500).json({
                data: false,
                status: "failed",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: "failed to login",
        });
    }
};

const particularData = async (req, res) => {
    try {
        console.log("hi req")
        const persons = await User.findById(req.body.userID);
        res.status(200).json(persons);
        console.log("==================",persons)
    } catch (err) {
        res.status(500).json({
            Message: "Some Error has Occured",
            Error: err,
        });
    }
};

module.exports = { userController, loginpage, particularData };
