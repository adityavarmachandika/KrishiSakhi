import { crop_details_service,soil_report_service } from "../services/crop_details.js";
import { fetch_crop_details_service } from "../services/crop_details.js";

export const crop_details= async (req,res)=>{

    const input= req.body;

    console.log("Received crop details input:", input);
    const saved_crop= await crop_details_service(input)

    if(saved_crop.success===false){
        return res.status(500).json({error:saved_crop.error})
    }
    res.status(201).json({"crop details saved":saved_crop})
}


export const soil_report= async (req,res)=>{
    const input= req.body;
    console.log("Received soil report input:", input);
    const saved_soil_report= await soil_report_service(input)

    if(saved_soil_report.success===false){
        return res.status(500).json({error:saved_soil_report.error})
    }
    res.status(201).json({"soil report saved":saved_soil_report})
}


export const fetch_crop_details= async (req,res)=>{
    const farmer_id= req.params.farmer_id;
    console.log("Fetching crop details for farmer_id:", farmer_id);
    const cropsWithReports= await fetch_crop_details_service(farmer_id)

    if(cropsWithReports.success===false){
        return res.status(500).json({error:cropsWithReports.error})
    }
    res.status(200).json(cropsWithReports)
}