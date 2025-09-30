import { CloudClient } from "chromadb";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { activity } from "../models/activity.js";
import { get_embedding } from "../services/get_embedding.js";
import { get_summary } from "../services/gemini_service.js";

dotenv.config();

// --- FIX: Lazy Initialization of Chroma Client ---
let chromaClient = null;

const getChromaClient = () => {
  if (!chromaClient) {
    console.log("LOG: Initializing ChromaDB Cloud Client for the first time...");
    
    const apiKey = process.env.CHROMA_API_KEY?.trim();
    const tenant = process.env.CHROMA_TENANT?.trim();

    if (!apiKey || !tenant) {
      console.error("FATAL ERROR: CHROMA_API_KEY or CHROMA_TENANT is missing.");
      throw new Error("Chroma client environment variables are not set.");
    }
    
    chromaClient = new CloudClient({
      apiKey,
      tenant,
      database: 'krishisakhi'
    });
  }
  return chromaClient;
};
// --- END FIX ---

async function getFarmerCollection(farmer_id, requestId) {
  const collectionName = `farmer_${farmer_id}`;
  console.log(`[${requestId}] LOG: Getting or creating Chroma collection: '${collectionName}'`);
  const chroma = getChromaClient();
  return await chroma.getOrCreateCollection({ name: collectionName });
}

/* History log semantic search and history summarizer service which is 
  feeded into the llm context for better output
*/
export const queryActivityService = async (farmer_id, crop_id, query) => {
  const requestId = `req_${Date.now()}`;
  
  console.log(`\n--- [${requestId}] Starting queryActivityService ---`);
  console.log(`[${requestId}] PARAMS: farmer_id=${farmer_id}, crop_id=${crop_id}, query="${query}"`);

  try {
    if (!farmer_id || !query) {
      console.error(`[${requestId}] ERROR: Missing required parameters.`);
      return { status: 400, error: "farmer_id and query are required" };
    }

    try {
      // 1️⃣ Generate embedding for query
      console.log(`[${requestId}] LOG: 1. Generating embedding for query...`);
      const queryEmbedding = await get_embedding(query);
      console.log(`[${requestId}] LOG: 1. Embedding generated successfully.`);

      // 2️⃣ Get farmer's Chroma collection
      console.log(`[${requestId}] LOG: 2. Accessing ChromaDB collection...`);
      const collection = await getFarmerCollection(farmer_id, requestId);
      console.log(`[${requestId}] LOG: 2. ChromaDB collection accessed.`);

      // 3️⃣ Query ChromaDB
      const whereFilter = crop_id ? { "crop_id": { "$eq": crop_id.toString() } } : {};
      console.log(`[${requestId}] LOG: 3. Querying ChromaDB with filter:`, JSON.stringify(whereFilter));
      
      const results = await collection.query({
        queryEmbeddings: [queryEmbedding],
        nResults: 5,
        where: whereFilter,
        include: ["metadatas", "documents", "distances"]
      });

      console.log(`[${requestId}] DEBUG: Full ChromaDB search results:`, JSON.stringify(results, null, 2));
      console.log(`[${requestId}] LOG: 3. ChromaDB query successful. Found ${results?.ids[0]?.length || 0} potential matches.`);

      const matchedIds = (results?.ids && results.ids[0]) ? results.ids[0] : [];

      if (!matchedIds.length) {
        console.log(`[${requestId}] LOG: No matching logs found in ChromaDB.`);
        return { status: 200, summary: "No matching logs found." };
      }
      console.log(`[${requestId}] LOG: Matched Chroma IDs: ${matchedIds.join(', ')}`);

      // 4️⃣ Fetch full logs from MongoDB
      const objectIds = matchedIds.map(id => new mongoose.Types.ObjectId(id));
      console.log(`[${requestId}] LOG: 4. Fetching full logs from MongoDB for ${objectIds.length} IDs...`);
      const fullLogs = await activity.find({ _id: { $in: objectIds } }).sort({ date: -1 });

      console.log(`[${requestId}] DEBUG: Content of matched MongoDB logs:`, JSON.stringify(fullLogs, null, 2));
      console.log(`[${requestId}] LOG: 4. Found ${fullLogs.length} documents in MongoDB.`);

      if (!fullLogs.length) {
        return { status: 200, summary: "No matching logs found in DB." };
      }

      // 5️⃣ & 6️⃣ Combine and Summarize
      const combinedText = fullLogs.map(l => `- ${l.log}`).join("\n");
      console.log(`[${requestId}] LOG: 5. Summarizing combined text...`);
      console.log(`[${requestId}] DEBUG: Combined text to summarize: "${combinedText}"`);
      const summarized = await get_summary(combinedText);
      console.log(`[${requestId}] LOG: 6. Summarization complete.`);
      
      // ✅ ADDED LOG: See the final summary that will be returned
      console.log(`[${requestId}] DEBUG: Final summary received from Gemini: "${summarized}"`);

      // 7️⃣ Return results
      console.log(`--- [${requestId}] Finished queryActivityService Successfully ---`);
      return {
        status: 200,
        matched_ids: matchedIds,
        results: fullLogs,
        summary: summarized
      };
      
    } catch (serviceError) {
      console.error(`--- [${requestId}] ERROR caught in Chroma/Embedding block ---`);
      console.error(serviceError);
      return {
        status: 200,
        summary: "No activity history available. A service may not be running."
      };
    }
    
  } catch (err) {
    console.error(`--- [${requestId}] FATAL ERROR in queryActivityService ---`);
    console.error(err);
    return { status: 500, error: "Failed to query activity" };
  }
};