const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
require("dotenv").config();

const {UserModel} = require("../models/user.model.js")
const {ProductModel} = require("../models/products.model.js")
const {authenticate} = require("../middlewares/authentication.js");
const {rbac} = require("../middlewares/rbac.js");

const productrouter = express.Router();

productrouter.use(authenticate);



productrouter.get("/",async (req,res)=>{
    try {
        let all = await ProductModel.find();
        res.send(all)

    } catch (error) {
        res.send({"msg":error.message});
    }
})

productrouter.post("/addproducts",rbac(["seller"]), async (req,res)=>{
    try {
        let {name,type,SKU} = req.body;
        let ifexist = await ProductModel.find({SKU});
        if(ifexist.length){
            res.send({msg:"product already in the database"})
        }else{
            let prod = new ProductModel({name,type,SKU});
            prod.save();
            res.send({msg:"Product Added to DB"})
        }

    } catch (error) {
        res.send({"msg":error.message});
    }
})

productrouter.delete("/deleteproducts/:id",rbac(["seller"]), async (req,res)=>{
    try {
        let SKU = req.params.id;
        let ifexist = await ProductModel.find({SKU:SKU});
        if(ifexist.length){
            await ProductModel.findOneAndDelete({SKU});
            res.send(res.send({msg:"Product Deleted from the DB"}))
        }else{
            res.send({msg:"No Such product in the DB"})
        }
    }catch (error) {
        res.send({"msg":error.message});
    }
})

module.exports = {productrouter}