import express from "express";
import { validate } from "./middleware/user_validate.js";
import { farmer_schema } from "./models/farmer.js";
import user_signup from "./controllers/user_auth.js";

const router = express.Router();


router.post("/signup",validate(farmer_schema),user_signup)


export default router