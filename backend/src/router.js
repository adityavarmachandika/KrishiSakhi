import express from "express";
import user_router from "./routes/user_routes.js";
import activity_router from "./routes/activity_logining.js";
import crop_router from "./routes/crop_details.js";
const router = express.Router();


router.use("/farmer",user_router)
router.use("/activity",activity_router)
router.use("/crop",crop_router)
export default router