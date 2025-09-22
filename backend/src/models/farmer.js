import mongoose from "mongoose";


//--farmer details schema
const farmer_details = new mongoose.Schema({
    farmer_id:{type:mongoose.Schema.Types.ObjectId, required:true, unique:true},
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    phone:{type:String, required:true, unique:true},
    password:{type:String, required:true},
})



module.exports=mongoose.model("farmer_details", farmer_details);