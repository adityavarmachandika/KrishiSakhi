import express from "express";
import { query_controller,fetch_all_queries} from "../controllers/query_controller.js";

const query_router = express.Router();

query_router.post("/query", query_controller);
query_router.get("/fetch_all_queries/:farmer_id", fetch_all_queries);

export default query_router;