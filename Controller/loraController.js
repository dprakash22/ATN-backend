const { LoRa, User  } = require("../Models/models");
const {ObjectId} = require("mongoose")

const getUserDetails = async(req,res) => {
try{
        const loraid = req.body.loRaID
        const LoRaDetails = await LoRa.findById(loraid)
        
        const userId = LoRaDetails.userId

        const userDetails = await User.findById(userId)

        res.status(200).json({user: userDetails})
    }catch(err){
        console.error(err)
        res.status(500).json({response: "unable to find user"})
    }
}

module.exports = {getUserDetails}
