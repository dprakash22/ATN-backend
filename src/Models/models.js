const mongoose = require("mongoose");
// const module = require('module')

const UserSchema = new mongoose.Schema({
    fname: { type: String },
    lname: { type: String },
    email: { type: String },
    mobile: { type: String },
    password: { type: String },
    address: { type: String },
});

const LoRaSchema = new mongoose.Schema({
    userId: { type: String },
    NoOfReq: { type: Number },
<<<<<<< HEAD
    city: { type: String },
=======
    city:{type:String}
>>>>>>> 134df9faa5e4cd76c8a34af012ee4707e07b8cf2
});

const RequestSchema = new mongoose.Schema({
    data: { type: Object },
    status: { type: String },
    loraID: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);
const LoRa = mongoose.model("LoRa", LoRaSchema);
const Request = mongoose.model("Request", RequestSchema);

module.exports = { User, LoRa, Request };
