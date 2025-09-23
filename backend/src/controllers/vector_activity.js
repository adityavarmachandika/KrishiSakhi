import { ChromaClient } from "chromadb";

import dotenv from 'dotenv';
import { get_embedding } from '../services/get_embedding.js';

dotenv.config();
const chroma = new ChromaClient({
  path: process.env.CHROMA_PATH 
});
async function getFarmerCollection(user_id) {
  const collectionName = `farmer_${user_id}`;
  return await chroma.getOrCreateCollection({ name: collectionName });
}

export const logActivity = async (req, res) => {
  try {
    const { user_id, crop_id, log, crop_condition } = req.body;

  

    const embedding = await get_embedding(log);
    const collection = await getFarmerCollection(user_id);
    await collection.add({
      ids: [Date.now().toString()], 
      embeddings: [embedding],
      metadatas: [{ crop_id: crop_id.toString(), crop_condition }],
      documents: [log]
    });

    res.json({ message: "Activity logged successfully" });
  } catch (err) {
    console.error("Error logging activity:", err);
    res.status(500).json({ error: "Failed to log activity" });
  }
};


export const queryActivity = async (req, res) => {
  try {
    const { user_id, query, crop_id } = req.body;

 
    const queryEmbedding = await get_embedding(query);
    const collection = await getFarmerCollection(user_id);
    const whereFilter = crop_id ? { crop_id: crop_id.toString() } : {};

    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: 5,
      where: whereFilter
    });

    const matchedDocs = results.documents[0] || [];
    const matchedMetadatas = results.metadatas[0] || [];

    res.json({ matches: matchedDocs, metadatas: matchedMetadatas });
  } catch (err) {
    console.error("Error querying activity:", err);
    res.status(500).json({ error: "Failed to query activity" });
  }
};
