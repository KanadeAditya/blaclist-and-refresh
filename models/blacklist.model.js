const mongoose = require("mongoose");

const blaclistschema = mongoose.Schema({
    token:{type:String,required:true},
    refreshtoken:{type:String,required:true}
})

const Blacklisted = mongoose.model("blacklist",blaclistschema);

module.exports = {Blacklisted};