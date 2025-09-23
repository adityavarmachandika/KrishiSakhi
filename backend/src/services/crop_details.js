import { crop,soil_report } from "../models/crop.js";


export const crop_details_service = async (data) => {
    try{
        const new_crop= new crop({
            farmer_id:data.farmer_id,
            soil_type:data.soil_type,
            feild_size:data.feild_size,
            irrigation_type:data.irrigation_type,
            previous_crops:data.previous_crops,
            location:data.location
        })

        const saved_crop= await new_crop.save();
        return saved_crop
    }
    catch(error){
        console.error("Error saving crop details:", error);
        return { success: false, error: "Database error" };
    }
}


export const soil_report_service = async (data) => {
    try{
        const new_soil_report= new soil_report({
            crop_id:data.crop_id,
            pH:data.pH,
            nitrogen:data.nitrogen,
            phosphorus:data.phosphorus,
            potassium:data.potassium,
            organicMatter:data.organicMatter,
            reportNotes:data.reportNotes
        })
        const saved_soil_report= await new_soil_report.save();
        return saved_soil_report
    }
    catch(error){
        console.error("Error saving soil report:", error);
        return { success: false, error: "Database error" };
    }
}


export const fetch_crop_details_service = async (farmer_id) => {
  try {
    const crops = await crop.find({ farmer_id: farmer_id }).lean(); // use .lean() for plain JS objects
    const soil_reports = await soil_report.find({
      crop_id: { $in: crops.map(c => c._id) }
    });

    // Attach soil reports to respective crops
    const cropsWithReports = crops.map(c => {
      const reports = soil_reports.filter(r => r.crop_id.toString() === c._id.toString());
      return { ...c, soil_reports: reports };
    });

    return cropsWithReports;
  } catch (err) {
    console.error("Error fetching crop details:", err);
    return { success: false, error: "Database error" };
  }
};
