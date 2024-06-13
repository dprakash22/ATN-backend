const { User } = require("../Models/models.js");
const mongoose = require("mongoose");

const userController = async (req, res) => {
    try {
        const userData = {
            password: req.body.password,
            confirmpassword: req.body.confirmpassword,
        };

        if (userData.password == userData.confirmpassword) {
            const a = await User.create({
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
                mobile: req.body.mobile,
                password: req.body.password,
            });
            console.log(a);
            res.status(200).json({
                status: "successfully created",
            });
        } else {
            console.log("give the correct password in both the fields");
            res.status(500).json({
                status: "not created",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(200).json({
            status: "failed to create",
            error: error,
        });
    }
};

const loginpage = async (req, res) => {
    cosole.log("entered login")
    console.log(req.body,'=======')
    if (req.body.email == "" || req.body.password == "") {
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
        console.log(err);
        res.status(500).json({
            status: "failed to login",
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

module.exports = { userController, loginpage, particularData };
