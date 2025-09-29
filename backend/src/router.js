import express from "express";
import multer from "multer";
import user_router from "./routes/user_routes.js";
import activity_router from "./routes/activity_logining.js";
import crop_router from "./routes/crop_details.js";
import vector_activity_routes from "./routes/vector_activity_routes.js";
import news_router from "./routes/news_route.js";


import query_router from "./routes/query_routes.js";
const router = express.Router();

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use("/farmer",user_router)
router.use("/activity",activity_router)
router.use("/crop",crop_router)
router.use("/vector",vector_activity_routes)
router.use("/news",news_router)

router.use("/chat",query_router)




export default router;