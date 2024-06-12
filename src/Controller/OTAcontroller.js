const { OTA } = require("../Models/models.js");
const path = require('path');

const getOTA = async()=>{
    try{
        const version = await OTA.find();
        return version[0];
    }catch(e){
        console.log(e)
    }
}

const getOTAversion = async(req,res)=>{
    try{
        console.log('in version')
        const version = await OTA.find();
        const value = {
            versionNumber:version[0].version
        }
        // res.write(version[0].version)
        res.status(200).send(version[0].version);
        console.log('out version')
    }catch(e){
        console.log(e)
        res.status(500).json({message:e})
    }
}

const getOTAcode=async(req,res)=>{
    try{
        console.log('in ota code')
        res.status(200).sendFile('Blink.ino.bin',{root:'../src/OTAcode/'})
        console.log('out ota code')
    }catch(e){
        console.log(e)
    }
}

module.exports = {getOTAversion, getOTAcode, getOTA }