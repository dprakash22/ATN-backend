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
            status: "failed to create",
            error: error,
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

const getData = async(req,res)=>{
    try{
        const x = req.body
        console.log(x)
        
    }catch(err){
        console.log(err)
    }   
}

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
