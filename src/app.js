const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const {User,LoRa,Reqest} = require('./Models/models')

const app = express()
app.use(cors())




app.listen(8000,()=>{
    console.log("Listening at 8000...")
})