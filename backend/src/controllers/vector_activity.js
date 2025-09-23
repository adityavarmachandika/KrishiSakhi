// controllers/activityController.js
import { ChromaClient } from "chromadb";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { activity } from "../models/activity.js";
import { get_embedding } from "../services/get_embedding.js";
import { get_summary } from "../services/gemini_service.js";

dotenv.config();

const chroma = new ChromaClient({ path: process.env.CHROMA_PATH });

async function getFarmerCollection(user_id) {
  const collectionName = `farmer_${user_id}`;
  return await chroma.getOrCreateCollection({ name: collectionName });
}

export const logActivity = async (req, res) => {
  try {
    const { user_id, crop_id, log, crop_condition, activity_id } = req.body;
    if (!user_id || !log) return res.status(400).json({ error: "user_id and log are required" });

    // Determine which mongo id to use:
    let mongoId = activity_id ? String(activity_id) : null;
    if (!mongoId) {
      console.log("No activity_id provided.");
      return res.status(400).json({ error: "activity_id is required" });
    }
      const exists = await activity.exists({ _id: mongoId });
      if (!exists) {
        return res.status(404).json({ error: "Provided activity_id not found in MongoDB" });
      }
    

    const embedding = await get_embedding(log);
    const collection = await getFarmerCollection(user_id);
    const minimalMeta = {
      mongo_id: mongoId,
      crop_id: crop_id ? crop_id.toString() : null,
      crop_condition: crop_condition ?? null
    };

    const shortDoc = log && log.length > 500 ? log.slice(0, 200) + "…" : log;

    // Use Mongo _id string as the Chroma id so query returns the IDs you can use directly in Mongo
    await collection.add({
      ids: [mongoId],
      embeddings: [embedding],
      metadatas: [minimalMeta],
      documents: [shortDoc] 
    });

    return res.json({ message: "Logged embedding to Chroma ", mongo_id: mongoId });
  } catch (err) {
    console.error("Error logging activity to Chroma:", err);
    return res.status(500).json({ error: "Failed to log activity" });
  }
};

export const queryActivity = async (req, res) => {
  try {
    const { user_id, query, crop_id, summarize = true } = req.body;
    if (!user_id || !query) return res.status(400).json({ error: "user_id and query are required" });

    const queryEmbedding = await get_embedding(query);
    const collection = await getFarmerCollection(user_id);
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

    if (!summarize) {
      return res.json({ matched_ids: matchedIds, results: fullLogs });
    }

    const combinedText = fullLogs
      .map(l => `- ${l.log} (Crop Condition: ${l.crop_condition || "N/A"}, id: ${l._id})`)
      .join("\n");

    if (!combinedText) return res.json({ msg: "No matching logs to summarize." });



    try{
      let summarized ="";
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
