const mongoose = require("mongoose");
// const module = require('module')

const UserSchema = new mongoose.Schema({
    fname: { type: String },
    lname: { type: String },
    email: { type: String },
    mobile: { type: String },
    password: { type: String },
    address: { type: String },
    uid:{type: String},
});

const SensorSchema = new mongoose.Schema({
    type: { type: String },
    data: { type: Object },
    date: { type: Date },
    latitude: {type:String},
    longitude: {type:String},
});

const LoRaSchema = new mongoose.Schema({
    userId: { type: String },
    NoOfReq: { type: Number },
    city: { type: String },
});

const RequestSchema = new mongoose.Schema({
    data: { type: Object },
    status: { type: String },
    loraID: { type: String },
    uid:{type: String},
    createdAt: { type: Date, default: Date.now },
});

const OTAschema = new mongoose.Schema({
    version : { type: String},
    code : { type : String }
})

const User = mongoose.model("User", UserSchema);
const LoRa = mongoose.model("LoRa", LoRaSchema);
const Request = mongoose.model("Request", RequestSchema);
const OTA = mongoose.model('OTA',OTAschema);
const Sensor = mongoose.model('Sensor',SensorSchema);

module.exports = { User, LoRa, Request, OTA, Sensor};

