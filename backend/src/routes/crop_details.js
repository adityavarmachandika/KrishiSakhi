import { crop_details,soil_report,fetch_crop_details } from "../controllers/crop_details.js";
import express from "express";
const crop_router = express.Router();

crop_router.post("/details_input",crop_details)
crop_router.post("/soil_report_input",soil_report)
crop_router.get("/fetch_crop_details/:farmer_id",fetch_crop_details)

export default crop_router