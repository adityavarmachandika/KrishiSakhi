import { crop_details_service,soil_report_service } from "../services/crop_details.js";

export const crop_details= async (req,res)=>{

    const input= req.body;

    const saved_crop= await crop_details_service(input)

    if(saved_crop.success===false){
        return res.status(500).json({error:saved_crop.error})
    }
    res.status(201).json({"crop details saved":saved_crop})
}


export const soil_report= async (req,res)=>{
    const input= req.body;

    const saved_soil_report= await soil_report_service(input)

    if(saved_soil_report.success===false){
        return res.status(500).json({error:saved_soil_report.error})
    }
    res.status(201).json({"soil report saved":saved_soil_report})
}