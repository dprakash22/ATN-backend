const express=require('express')
const app=express()

app.get('/msg',(req,res)=>{

    res.status(200).json({
         "name":"deepak"
    })
    console.log("success")
})

const conToDB = async() =>{
    try{
        // await mongoose.connect("http://localhost:8000/")
        console.log("connected to db")
        app.listen(8000,()=>{console.log("listening at 8000...")})
    }catch(e){
        console.log(e)
        console.log("coundn't establish connection....")
    }
}

conToDB()