import { ca } from "zod/v4/locales";
import { save_activity } from "../services/activity_logging.js"
import { logActivity } from "../services/vector_activity.js";


export const log_activity= async(req,res)=>{

    try{
    const input= req.body;

    const saved_activity= await save_activity(input)


    if(saved_activity.success===false){
        return res.status(500).json({error:saved_activity.error})
    }
 // Step 2: Extract fields + mongo_id
    const { crop_id,farmer_id, log, crop_condition } = input;
    const activity_id = saved_activity.data?._id || saved_activity._id; // depends on your save_activity return shape

    // Step 3: Save embedding in Chroma
    const chromaResult = await logActivity(
      farmer_id,
      crop_id,
      log,
      crop_condition,
      activity_id
    );

    // Step 4: Send response
    return res.status(201).json({
      message: "Activity logged successfully",
      activity: saved_activity,
      chroma: chromaResult,
    });
}catch(err){
    console.error("Error in log_activity controller:", err);
    return res.status(500).json({ error: "Internal server error" });
}


}