const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const {Blacklisted} = require("../models/blacklist.model.js")

const {UserModel} = require("../models/user.model.js");

const userrouter = express.Router();

userrouter.get("/",async (req,res)=>{
    try {
        let allusers = await UserModel.find();
        res.send(allusers)
    } catch (error) {
        res.send({"msg":error.message})
    }
})

userrouter.post("/signup", async (req,res)=>{
    try {
        const {email,password,name,role} = req.body;
        
        let ifexist = await UserModel.find({email});

        if(ifexist.length){
            res.send({"msg":"This email already exists , please login"})
        }else{
            bcrypt.hash(password, 8, (err, hash)=>{
                // Store hash in your password DB.
                if(err){
                    res.send({"msg":err});
                }else{
                    let obj  = {email,password:hash,name,role};
                    let user = new UserModel(obj)
                    user.save();
                    res.send({"msg":"Account added to Database"});
                }
            });
        }

    } catch (error) {
        res.send({"msg":error.message})
    }
})

userrouter.post("/login", async (req,res)=>{
    try {
        const {email,password} = req.body;
        
        let ifexist = await UserModel.find({email});

        if(ifexist.length){
            let user = ifexist[0];
            bcrypt.compare(password, user.password, function(err, result) {
                // result == true
                if(err){
                    res.send({"msg":err});
                }else{
                    if(result){
                        let token = jwt.sign({email:user.email,role:user.role,Userid:user._id}, process.env.normalkey , { expiresIn: 60});
                        let refreshtoken = jwt.sign({email:user.email,role:user.role,Userid:user._id}, process.env.secretkey , { expiresIn: 60*5});
                        res.send({token,refreshtoken});
                    }else{
                        res.send({"msg":"Wrong Credentials , Please check the password"})
                    }
                }
            });
        }else{
            res.send({"msg":"Wrong Credentials , Please check the email"})
        }
    } catch (error) {
        res.send({"msg":error.message})
    }
})

userrouter.post("/logout",(req,res)=>{
    try {
        const {token,refreshtoken} = req.body
    
        if(token && refreshtoken){
            let obj = {token,refreshtoken};
            let black = new Blacklisted(obj);
            black.save();
            res.send({"msg":"Account Logged out"});
        }else{
            res.send({"msg":"Please provide both tokens"})
        }
    } catch (error) {
        res.send({"msg":error.message})
    }
})

userrouter.get("/refresh", async (req,res)=>{
    try {
        let refreshtoken = req.headers.authorization;
        if(refreshtoken){
            let ifexist = await Blacklisted.find({refreshtoken:refreshtoken})
            if(ifexist.length){
                res.send({"msg":"please login again"});
            }else{
                jwt.verify(refreshtoken, process.env.secretkey, (err, decoded)=>{
                    if(err){
                        res.send({msg:err});
                    }else{
                        const {email,role,Userid} = decoded;
                        let token = jwt.sign({email,role,Userid}, process.env.normalkey , { expiresIn: 60});
                        res.send({token})
                    }
                });
               
            }
        }else{
            res.send({msg:"please provide the token"})
        }
        
    } catch (error) {
        res.send({"msg":error.message})
    }
})

module.exports = {userrouter}