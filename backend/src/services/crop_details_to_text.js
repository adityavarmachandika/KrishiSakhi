// services/cropService.js
import { crop } from "../models/crop.js";

export async function getCropDetailsText(crop_id) {
  try {
    const crop = await Crop.findById(crop_id)
      .populate("farmer_id", "name contact address") // adjust fields as per your farmer schema
      .lean();

    if (!crop) return null;

    // Format details into a readable text block
    const cropText = `
Crop Details:
- Farmer: ${crop.farmer_id?.name || "N/A"}
- Soil Type: ${crop.soil_type || "N/A"}
- Field Size: ${crop.feild_size || "N/A"} acres
- Irrigation Type: ${crop.irrigation_type || "N/A"}
- Previous Crops: ${crop.previous_crops?.join(", ") || "N/A"}
- Location: Latitude ${crop.location?.latitude}, Longitude ${crop.location?.longitude}
    `.trim();

    return cropText;
  } catch (err) {
    console.error("Error fetching crop details:", err);
    return null;
  }
}
