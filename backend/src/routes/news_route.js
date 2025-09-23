import express from "express";
import axios from "axios";

const news_router = express.Router();
const API_KEY = process.env.NEWS_API_KEY;
const Domains=process.env.NEWS_DOMAINS;
const news_api=process.env.NEWS_API;

news_router.get("/", async (req, res) => {
  const {crop_name, location,farmer_id} = req.query; 
  try {
    const { data } = await axios.get(`${news_api}`, {
      params: {
        q:`${crop_name}`,
        domains: `${Domains}`,
        apiKey: API_KEY,
      },
    });

    res.json(data); 
  } catch (err) {
    console.error("Error fetching news:", err.message);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

export default news_router;
