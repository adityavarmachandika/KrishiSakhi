
import mongoose from "mongoose";
import { activity } from "../models/activity.js";

export async function save_activity(data) {
  try {
    const new_activity = new activity({
    crop_id:new mongoose.Types.ObjectId(data.crop_id),
    farmer_id:new mongoose.Types.ObjectId(data.farmer_id),
      date: new Date(),
      log: data.log,
      crop_condition: data.crop_condition,
    });

    await new_activity.save();

    return new_activity
  } catch (err) {
    console.error("Error saving activity:", err);
    return { success: false, error: "Database error" };
  }
}


export async function fetch_activity_details_service(farmer_id){
  try{
    const activities = await activity.find({ farmer_id: farmer_id }).lean(); // use .lean() for plain JS objects
    return activities;
  }
  catch(err){
    console.error("Error fetching activities:", err);
    return { success: false, error: "Database error" };
  }
}