import express from "express";
import { logActivity, queryActivity } from "../controllers/vector_activity.js";

const router = express.Router();

router.post("/log", logActivity);
router.post("/query", queryActivity);

export default router;
