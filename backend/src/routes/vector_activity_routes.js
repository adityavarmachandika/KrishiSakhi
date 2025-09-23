import express from "express";
import {  queryActivity } from "../controllers/vector_activity.js";

const router = express.Router();

router.post("/query", queryActivity);

export default router;
