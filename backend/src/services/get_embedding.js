import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const get_embedding = async (text) => {
  if (!text || typeof text !== "string" || text.trim() === "") {
    throw new Error("Invalid input for embedding");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

    const result = await model.embedContent({
      content: { parts: [{ text }] },
      taskType: "SEMANTIC_SIMILARITY",   // request similarity embeddings         // force 3072 dims
    });

    const embedding = result.embedding.values;
    console.log("Gemini embedding length:", embedding.length); // should print 3072

    return embedding;
  } catch (error) {
    console.error(
      "Gemini Embedding Error:",
      error.response?.data || error.message || error
    );
    throw new Error("Failed to generate embedding");
  }
};
