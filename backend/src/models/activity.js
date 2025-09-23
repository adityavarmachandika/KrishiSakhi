import mongoose from "mongoose";
import { z } from "zod";




//--activity details schema
const activitySchema = new mongoose.Schema({
    crop_id:{type:mongoose.Schema.Types.ObjectId, ref:'crop_details'},
    farmer_id:{type:mongoose.Schema.Types.ObjectId, ref:'farmer_details'},
    date: { type: Date, default: Date.now },
    log: { type: String, required: true },
    crop_condition: { type: String,required:true },
})


const activity_schema = z.object({
  crop_id: z.string(),
  farmer_id: z.string(),
  log: z.string(),
  crop_condition: z.string(),
});


const activity = mongoose.model("activity", activitySchema);


export {activity,activity_schema};