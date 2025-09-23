import express from "express";
import { validate } from "../middleware/user_validate.js";
import { farmer_schema ,loginSchema} from "../models/farmer.js";
import {user_signup,user_login} from "../controllers/user_auth.js";


const user_router = express.Router();



user_router.post("/signup",validate(farmer_schema),user_signup)
user_router.post("/login",validate(loginSchema),user_login)


export default user_router