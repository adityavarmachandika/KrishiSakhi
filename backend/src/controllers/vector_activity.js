// controllers/activityController.js
import { ChromaClient } from "chromadb";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { activity } from "../models/activity.js";
import { get_embedding } from "../services/get_embedding.js";
import { get_summary } from "../services/gemini_service.js";

dotenv.config();

const chroma = new ChromaClient({ path: process.env.CHROMA_PATH });

async function getFarmerCollection(farmer_id) {
  const collectionName = `farmer_${farmer_id}`;
  return await chroma.getOrCreateCollection({ name: collectionName });
}


/* Query activity logs based on user input, returning full logs and a summary if requested */


export const queryActivity = async (req, res) => {
  try {
    const {farmer_id, crop_id,query } = req.body;
    if (!farmer_id || !query) return res.status(400).json({ error: "farmer_id and query are required" });

    const queryEmbedding = await get_embedding(query);
    const collection = await getFarmerCollection(farmer_id);
    const whereFilter = crop_id ? { crop_id: crop_id.toString() } : {};

    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: 5,
      where: whereFilter
    });

    // Chroma typically returns arrays-of-arrays for multi-query:
    const matchedIds = (results?.ids && results.ids[0]) ? results.ids[0] : [];

    if (!matchedIds.length) {
      return res.json({ msg: "No matching logs found." });
    }

    const objectIds = matchedIds.map(id => {
      try { return mongoose.Types.ObjectId(id); } catch { return id; }
    });

    const fullLogs = await activity.find({ _id: { $in: objectIds } }).sort({ date: -1 });

    const combinedText = fullLogs
      .map(l => `- ${l.log} (Crop Condition: ${l.crop_condition || "N/A"}, id: ${l._id})`)
      .join("\n");

      //summarizing the text

    if (!combinedText) return res.json({ msg: "No matching logs to summarize." });

      let summarized ="";

    try{
     
      summarized= await get_summary(combinedText);
    }catch(e){
      console.error("Error during summarization:", e);
      return res.status(500).json({ error: "Failed to summarize activity logs" });
    }


    return res.json({
      matched_ids: matchedIds,
      results: fullLogs,
      summary: summarized
    });
  }
   catch (err) {
    console.error("Error querying activity:", err);
    return res.status(500).json({ error: "Failed to query activity" });
  }
};
