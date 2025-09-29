import { query as QueryModel } from "../models/query.js";
import { queryActivityService } from "../services/summarize_log.js";
import { chatWithGemini } from "../services/gemini_service.js";
import { getCropDetailsText } from "../services/crop_details_to_text.js";
import { all_queries_service } from "../services/all_queries.js";


export const query_controller = async (req, res) => {
  try {
    const { farmer_id, query, crop_id } = req.body;

    if (!farmer_id || !query) {
      return res.status(400).json({ error: "farmer_id and query are required" });
    }

    const newQuery = new QueryModel({
      farmer_id,
      crop_id,
      question: query, 
      date: new Date(),
    });

    await newQuery.save();

    // Fetching relevant activity logs and summarize
    const { status, matched_ids, results, summary } = await queryActivityService(farmer_id, crop_id, query);

    if (status !== 200) {
      return res.status(status).json({ error: summary || "Error fetching activity logs" });
    }

    const crop_context = crop_id ? await getCropDetailsText(crop_id) : "No crop details available";

    // Preparing contexts for Gemini
    const history_context = `Relevant farmer activity history:\n${summary}`;
    const weather_context = `Current weather: Sunny, 30°C, 60% humidity, no rain forecast for next 3 days.`;
    

const systemPrompt = `
You are an expert agricultural assistant. Answer the user's query using the following context:
User Query: ${query}

Farmer Activity History:${history_context}

Crop Context:${crop_context}

Weather Context:
${weather_context}

If the context does not contain relevant info, answer based on your own knowledge.
Make the answer brief and concise. If unsure, just say "I don't know". Do not fabricate answers.
    `;

    const geminiResponse = await chatWithGemini(systemPrompt);


   
    newQuery.answer = geminiResponse;
    await newQuery.save();

    
    res.json({ results:newQuery});
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
};


export const fetch_all_queries= async (req,res)=>{
    const farmer_id= req.params.farmer_id;

    if(!farmer_id){
      return res.status(400).json({error:"farmer_id is required"})
    }

    try{
      const queries= await all_queries_service(farmer_id)
      if(queries.success===false){
        return res.status(500).json({error:queries.error})
      }
      res.status(200).json(queries)
    }
    catch(err){
      console.error("Error in fetch_all_queries controller:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
}