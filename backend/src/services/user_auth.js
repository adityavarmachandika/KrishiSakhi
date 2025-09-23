import mongoose from "mongoose";
import {farmer_details} from "../models/farmer.js";



export const user_signup_service = async (farmer) => {
    try{
        const new_farmer= new farmer_details({
        name : farmer.name,
        email : farmer.email,
        phone : farmer.phone,
        password : farmer.password,
    })

    const saved_farmer= await new_farmer.save();

    console.log("Farmer registered:", saved_farmer);

    return saved_farmer
    }
    catch(error){
        console.error("Error registering farmer:", error);
    }  
}


export const user_login_service = async (phone)=>{
    try {
        const farmer = await farmer_details.findOne({phone:phone});
        return farmer;
    } catch (error) {
        console.error("Error fetching farmer details:", error);
    }
}