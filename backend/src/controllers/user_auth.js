
import bcrypt from "bcrypt";
import {user_login_service, user_signup_service} from "../services/user_auth.js";
import { jwt_token_generation } from "../services/jwt.js";


export const user_signup = async (req, res) => {
    
    const input=req.body;

    const hashed_password= await bcrypt.hash(input.password, 10);
    input.password=hashed_password;

    const new_farmer=await user_signup_service(input)

    const token=  jwt_token_generation(new_farmer,res)

    const farmerWithToken = { ...new_farmer.toObject(), token };

    res.status(201).json({"data inserted":farmerWithToken})
}



export const user_login = async (req, res) => {
    

    const input= req.body;
    const farmer_details= await user_login_service(input.phone)

    if(!farmer_details){
        return res.status(400).json({error:"User not found"})
    }
    const password_match= await bcrypt.compare(input.password, farmer_details.password)

    if(!password_match){
        return res.status(400).json({error:"Invalid credentials"})
    }

    const token= await jwt_token_generation(farmer_details,res)

    const farmerWithToken = { ...farmer_details.toObject(), token };
    console.log("generated token:",token)
    res.status(200).json({"login successful":farmerWithToken})
}



