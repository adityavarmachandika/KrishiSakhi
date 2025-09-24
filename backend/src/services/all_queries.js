import mongoose from "mongoose"
import { query } from "../models/query.js"

export const all_queries_service=(farmer_id)=>{
    try{
        const all_queries= query.find({farmer_id:farmer_id})
        return all_queries
    }
    catch(err){
        console.error("Error fetching queries:", err);
        return { success: false, error: "Database error" };
    }
}