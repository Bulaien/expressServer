const express = require('express');

const mongoose = require('mongoose');
require('dotenv').config()
var cors = require('cors');

const app = express();
app.use(cors());

// middleware to read request data in post and put and converet ot js object 
app.use(express.json());

// database connection 

mongoose.connect(process.env.ATLAS_URI)
.then(()=>{
    console.log("Datenbank verbunden")
})
.catch((err)=>{
    console.log(err)
})




const softwareSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is Mandatory"]
    },
    url:{
        type:String,
        required:[true,"Url is Mandatory"]
    },
    download:{
        type:String,
        required:[true,"Download link is Mandatory"]
    }
    
},{timestamps:true})



// model creation 

const softwareModel = mongoose.model("software",softwareSchema);



app.get("/softwares",(req,res)=>{


    softwareModel.find()
    .then((software)=>{
        res.send(software);
    })
    .catch((err)=>{
        console.log(err);
        res.send({message:"Some Problem"})
    })

   

})




app.get("/softwares/:name",(req,res)=>{

    softwareModel.findOne({name:req.params.name})
    .then((software)=>{
        res.send(software);
    })
    .catch((err)=>{
        console.log(err);
        res.send({message:"Some Problem"})
    })


})





// endpoint to create a software 
app.post("/softwares",(req,res)=>{

    let software = req.body;
    softwareModel.create(software)
    .then((document)=>{
        res.send({data:document,message:"software Created"})
    })
    .catch((err)=>{
        console.log(err);
        res.send({message:"Some Problem"})
    })

   
})


// endpoint to delete 

app.delete("/softwares/:id",(req,res)=>{

    softwareModel.deleteOne({_id:req.params.id})
    .then((info)=>{
        res.send({message:"software Deleted"})
    })
    .catch((err)=>{
        console.log(err);
        res.send({message:"Some Problem"})
    })
    

})


// endpoint to update 
app.put("/softwares/:id",(req,res)=>{

   let software = req.body;

   softwareModel.updateOne({_id:req.params.id},software)
   .then((info)=>{
        res.send({message:"software Updated"})
    })
    .catch((err)=>{
        console.log(err);
        res.send({message:"Some Problem"})
    })


})



// express.json(req,res,next)
// {
//     let software="";
//     req.on("data",(chunk)=>{
//         software+=chunk;
//     })

//     req.on("end",()=>{
//        req.body = JSON.parse(software);
//        next()
//     })

// }











app.get("/testing/:id",middleman,(req,res)=>{

    console.log("main endpoint")
    res.send({message:"Testing request"})
    //100

})


function middleman(req,res,next)
{
    if(req.params.id<10)
    {
        res.send({message:"You are blocked"})
    }
    else 
    {
        next()
    }
}




app.listen(8000,()=>{
    console.log("Server Up and running");
})