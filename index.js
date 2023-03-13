const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
require("dotenv").config();
const {connection} = require("./config.js");
const {userrouter} = require("./controller/user.routes.js")
const {productrouter} = require("./controller/products.route.js")

const app = express();

app.use(cors());
app.use(express.json())

app.use("/users",userrouter);
app.use("/products",productrouter);


app.get("/",(req,res)=>{
    res.send("HOME PAGE")
})



app.listen(process.env.port,async ()=>{
    try {
        await connection;
        console.log({msg:"Server is running and connected to mongo DB Atlas"})
    } catch (error) {
        
    }
})