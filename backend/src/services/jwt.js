
import jwt from "jsonwebtoken";


export const jwt_token_generation=(farmer_details,res)=>{
    try{
    const payload = {
      userid: farmer_details._id,
      username: farmer_details.name,
      email: farmer_details.email,
      phone: farmer_details.phone,
    };

    // sign JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    return token
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
}