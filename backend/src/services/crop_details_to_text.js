// services/cropService.js
import { crop } from "../models/crop.js";

export async function getCropDetailsText(crop_id) {
  try {
    const crop_model = await crop.findById(crop_id)
      .populate("farmer_id", "name contact address") // adjust fields as per your farmer schema
      .lean();

    if (!crop_model) return null;

    // Format details into a readable text block
    const cropText = `
Crop Details:
- Farmer: ${crop_model.farmer_id?.name || "N/A"}
- Soil Type: ${crop_model.soil_type || "N/A"}
-crop name: ${crop_model.present_crop || "N/A"}
- Field Size: ${crop_model.feild_size || "N/A"} acres
- Irrigation Type: ${crop_model.irrigation_type || "N/A"}
- Previous Crops: ${crop_model.previous_crops?.join(", ") || "N/A"}
- Location: Latitude ${crop_model.location?.latitude}, Longitude ${crop.location?.longitude}
    `.trim();

    return cropText;
  } catch (err) {
    console.error("Error fetching crop details:", err);
    return null;
  }
}
