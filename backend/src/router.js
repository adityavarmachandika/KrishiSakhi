import express from "express";
import user_router from "./routes/user_routes.js";

const router = express.Router();


router.use("/farmer",user_router)

export default router