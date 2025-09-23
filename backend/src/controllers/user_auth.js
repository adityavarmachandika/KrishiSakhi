
import bcrypt from "bcrypt";
import user_signup_service from "../services/user_auth.js";


const user_signup = async (req, res) => {
    
    const input=req.body;

    const hashed_password= await bcrypt.hash(input.password, 10);
    input.password=hashed_password;

    const new_farmer=await user_signup_service(input)

    res.status(201).json({"data inserted":new_farmer})
}

export default user_signup
