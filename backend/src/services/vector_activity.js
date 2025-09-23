
import { ChromaClient } from "chromadb";
import dotenv from "dotenv";
import { activity } from "../models/activity.js";
import { get_embedding } from "../services/get_embedding.js";

dotenv.config();

const chroma = new ChromaClient({ path: process.env.CHROMA_PATH });

async function getFarmerCollection(farmer_id) {
  const collectionName = `farmer_${farmer_id}`;
  return await chroma.getOrCreateCollection({ name: collectionName });
}


export const logActivity = async (farmer_id, crop_id, log, crop_condition, activity_id) => {
  try {
    if (!farmer_id || !log) {
      return { status: 400, error: "user_id and log are required" };
    }

    let mongoId = activity_id ? String(activity_id) : null;
    if (!mongoId) {
      return { status: 400, error: "activity_id is required" };
    }

    const exists = await activity.exists({ _id: mongoId });
    if (!exists) {
      return { status: 404, error: "Provided activity_id not found in MongoDB" };
    }

    const embedding = await get_embedding(log);
    const collection = await getFarmerCollection(farmer_id);

    const minimalMeta = {
      mongo_id: mongoId,
      crop_id: crop_id ? crop_id.toString() : null,
      crop_condition: crop_condition ?? null
    };

    const shortDoc = log && log.length > 500 ? log.slice(0, 200) + "…" : log;

    await collection.add({
      ids: [mongoId],
      embeddings: [embedding],
      metadatas: [minimalMeta],
      documents: [shortDoc]
    });

    return { status: 200, message: "Logged embedding to Chroma", mongo_id: mongoId };
  } catch (err) {
    console.error("Error logging activity to Chroma:", err);
    return { status: 500, error: "Failed to log activity" };
  }
};
