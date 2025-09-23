import express from "express";
import { query_controller} from "../controllers/query_controller.js";

const query_router = express.Router();

query_router.post("/query", query_controller);



export default query_router;