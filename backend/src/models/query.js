import mongoose from "mongoose";

import {z} from "zod";



const query_schema = new mongoose.Schema({
    farmer_id:{type:mongoose.Schema.Types.ObjectId, ref:'farmer_details'},
    crop_id:{type:mongoose.Schema.Types.ObjectId, ref:'crop_details'},
    question:{type:String, required:true},
    answer:{type:String},
    translated_query:{type:String},
    translated_answer:{type:String},
    date:{type:Date, default:Date.now}
})


const query_validation_schema = z.object({
    farmer_id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
    crop_id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
    question: z.string().min(10, "Question must be at least 10 characters long"),
    answer: z.string().optional(),
});

const query = mongoose.model("query", query_schema);

export { query, query_validation_schema };