import mongoose from "mongoose";
import { z } from "zod";

//--farmer details schema
const cropSchema = new mongoose.Schema({
    farmer_id:{type:mongoose.Schema.Types.ObjectId, ref:'farmer_details'},
    soil_type:{type:String},
    feild_size:{type:Number},
    irrigation_type:{type:String},
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
})


const soilReportSchema= new mongoose.Schema({
    crop_id:{type:mongoose.Schema.Types.ObjectId, ref:'crop_details', unique:true},
    pH: { type: Number, required: true },
    nitrogen: { type: Number, required: true },
    phosphorus: { type: Number, required: true },
    potassium: { type: Number, required: true },
    organicMatter: { type: Number },
    reportNotes: { type: String }
})



const crop_validation_schema = z.object({
  farmer_id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
  soil_type: z.string().optional(),
  feild_size: z.number().optional(),
  irrigation_type: z.string().optional(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
});


const soil_report_validation_schema = z.object({
  crop_id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
  pH: z.number(),
  nitrogen: z.number(),
  phosphorus: z.number(),
  potassium: z.number(),
  organicMatter: z.number().optional(),
  reportNotes: z.string().optional(),
});

const crop = mongoose.model("crop", cropSchema);
const soil_report = mongoose.model("soil_report", soilReportSchema);

export { crop, soil_report, soil_report_validation_schema, crop_validation_schema };

