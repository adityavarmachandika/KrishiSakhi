
import { ChromaClient } from "chromadb";
import dotenv from "dotenv";
import { activity } from "../models/activity.js";
import { get_embedding } from "../services/get_embedding.js";
import { get_summary } from "../services/gemini_service.js";

dotenv.config();

const chroma = new ChromaClient({ path: process.env.CHROMA_PATH });

async function getFarmerCollection(farmer_id) {
  const collectionName = `farmer_${farmer_id}`;
  return await chroma.getOrCreateCollection({ name: collectionName });
}

/* history log semantic search and history summarizer service which is feeded into the llm context for better output*/

export const queryActivityService = async (farmer_id, crop_id, query) => {
  try {
    if (!farmer_id || !query) {
      return { status: 400, error: "farmer_id and query are required" };
    }

    // 1️⃣ Generate embedding for query
    const queryEmbedding = await get_embedding(query);

    // 2️⃣ Get farmer's Chroma collection
    const collection = await getFarmerCollection(farmer_id);

    // 3️⃣ Query ChromaDB
    const whereFilter = crop_id ? { crop_id: crop_id.toString() } : {};
    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: 5,
      where: whereFilter
    });

    const matchedIds = (results?.ids && results.ids[0]) ? results.ids[0] : [];

    if (!matchedIds.length) {
      return { status: 200, matched_ids: [], results: [], summary: "No matching logs found." };
    }

    // 4️⃣ Convert to ObjectId and fetch full logs from MongoDB
    const objectIds = matchedIds.map(id => {
      try { return mongoose.Types.ObjectId(id); } catch { return id; }
    });

    const fullLogs = await activity.find({ _id: { $in: objectIds } }).sort({ date: -1 });

    if (!fullLogs.length) {
      return { status: 200, matched_ids: matchedIds, results: [], summary: "No matching logs found in DB." };
    }

    // 5️⃣ Combine logs for summarization
    const combinedText = fullLogs
      .map(l => `- ${l.log} (Crop Condition: ${l.crop_condition || "N/A"}, id: ${l._id})`)
      .join("\n");

    // 6️⃣ Summarize using Gemini
    let summarized = "";
    try {
      summarized = await get_summary(combinedText);
    } catch (e) {
      console.error("Error during summarization:", e);
      summarized = "Failed to summarize activity logs.";
    }

    // 7️⃣ Return results
    return {
      status: 200,
      matched_ids: matchedIds,
      results: fullLogs,
      summary: summarized
    };
  } catch (err) {
    console.error("Error querying activity service:", err);
    return { status: 500, error: "Failed to query activity" };
  }
};
