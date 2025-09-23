import mongoose from "mongoose";


//--farmer details schema
const cropSchema = new mongoose.Schema({
    farmer_id:{type:mongoose.Schema.Types.ObjectId, ref:'farmer_details', unique:true},
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

const activityLogSchema = new mongoose.Schema({
    crop_id:{type:mongoose.Schema.Types.ObjectId, ref:'crop_details', unique:true},
    date: { type: Date, default: Date.now },
    log: { type: String, required: true },
    crop_condition: { type: String,required:true },
})


const crop = mongoose.model("crop", cropSchema);
const soil_report = mongoose.model("soil_report", soilReportSchema);
const activity_log = mongoose.model("activity_log", activityLogSchema);

export { crop, soil_report,activity_log};

