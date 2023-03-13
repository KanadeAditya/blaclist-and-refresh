const mongoose = require("mongoose");

const userschema = mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    role:{type:String,required:true,default:"user",enum:["user","seller"]}
})

const UserModel = mongoose.model("user",userschema);

module.exports = {UserModel};