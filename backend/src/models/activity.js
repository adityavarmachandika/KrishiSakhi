import mongoose from "mongoose";
import { farmer } from "./farmer";



//--activity details schema
const activitySchema = new mongoose.Schema({
    crop_id:{type:mongoose.Schema.Types.ObjectId, ref:'crop_details', unique:true},
    farmer_id:{type:mongoose.Schema.Types.ObjectId, ref:'farmer_details', unique:true},
    date: { type: Date, default: Date.now },
    log: { type: String, required: true },
    crop_condition: { type: String,required:true },
})


