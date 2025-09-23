import express from "express";
import { validate } from "../middleware/user_validate.js";
import { activity_schema } from "../models/activity.js";
import { fetch_activities, log_activity } from "../controllers/activty_logging.js";



const activity_router = express.Router();


activity_router.post("/log",validate(activity_schema),log_activity)
activity_router.get("/fetch_activities/:farmer_id",fetch_activities)
export default activity_router