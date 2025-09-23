import mongoose from "mongoose";

import zod from "zod";
import { z } from "zod";


//--farmer details schema
export const farmer = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, unique:true},
    phone:{type:String, required:true, unique:true},
    password:{type:String, required:true},
})


//--for zod validation
    export const farmer_schema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.union([z.string().email("Invalid email address"), z.string().length(0)]).optional(),
    phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters long")
    });


//--user login zod validation
export const loginSchema = z.object({
  phone: z.string().min(10, "Phone number too short"),
  password: z.string().min(6, "Password too short"),
});


export const farmer_details=mongoose.model("farmer_details",farmer)







