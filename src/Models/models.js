const mongoose = require('mongoose')
// const module = require('module')

const UserSchema = new mongoose.Schema({
    fname:{type:String},
    lname:{type:String},
    email:{type:String},
    mobile:{type:String},
    password :{type:String}
})

const LoRaSchema = new mongoose.Schema({
    userId:{type:String},
    NoOfReq:{type:Number}
})

const RequestSchema = new mongoose.Schema({
    data:{type:Object},
    status:{type:String},
    userID:{type:String}
})

const User = mongoose.model('User',UserSchema)
const LoRa = mongoose.model('LoRa',LoRaSchema)
const Reqest = mongoose.model('Request',RequestSchema)

module.exports={User,LoRa,Reqest}