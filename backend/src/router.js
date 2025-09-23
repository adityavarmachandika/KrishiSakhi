import express from "express";
import multer from "multer";
import user_router from "./routes/user_routes.js";
import activity_router from "./routes/activity_logining.js";
import crop_router from "./routes/crop_details.js";
import { transcribeRequestAudio } from "./services/speech_text.js";
const router = express.Router();

router.use("/farmer", user_router);
router.use("/activity", activity_router);
router.use("/crop", crop_router);

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/speech_text", upload.single("audio"), transcribeRequestAudio);

export default router;