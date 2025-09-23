import { save_activity } from "../services/activity_logging.js"




export const log_activity= async(req,res)=>{
    const input= req.body;

    const saved_activity= await save_activity(input)

    if(saved_activity.success===false){
        return res.status(500).json({error:saved_activity.error})
    }
    res.status(201).json({"activity logged":saved_activity})



}