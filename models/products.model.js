const mongoose = require("mongoose");

const productsschema = mongoose.Schema({
    name:{type:String,required:true},
    type:{type:String,required:true},
    SKU:{type:Number,required:true}
})

const ProductModel = mongoose.model("product",productsschema);

module.exports = {ProductModel};