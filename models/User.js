const { timeStamp } = require('console');
const mongoose=require('mongoose');
const { type } = require('os');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    }
},{timeStamp:true});
module.exports=mongoose.model("User",userSchema);


