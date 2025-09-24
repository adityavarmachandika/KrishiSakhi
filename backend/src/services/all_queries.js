import mongoose from "mongoose"
import { query } from "../models/query.js"

export const all_queries_service = async (farmer_id) => {
    try {
        const all_queries = await query.find({ farmer_id: farmer_id }).sort({ date: 1 }); // Changed from -1 to 1 for ascending order
        return { success: true, data: all_queries };
    }
    catch (err) {
        console.error("Error fetching queries:", err);
        return { success: false, error: "Database error" };
    }
}