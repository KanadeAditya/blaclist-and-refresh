const jwt = require("jsonwebtoken");
const {Blacklisted} = require("../models/blacklist.model.js");
require("dotenv").config();

const authenticate = async (req,res,next)=>{
    try {
        let token = req.headers.authorization;
        if(token){
            let ifexist = await Blacklisted.find({token:token});
            if(ifexist.length){
                res.send({msg:"Please Login Again"});
            }else{
                jwt.verify(token, process.env.normalkey , (err, decoded)=>{
                    if(err){
                        res.send({msg:err});
                    }else{
                        req.body.userID = decoded.Userid;
                        req.body.email = decoded.email;
                        req.body.role = decoded.role;
                        next();
                    }
                });
            }
        }else{
            res.send({msg:"Acces Denied"});
        }
    } catch (error) {
        res.send({msg:error.message});
    }
}

module.exports = {authenticate}