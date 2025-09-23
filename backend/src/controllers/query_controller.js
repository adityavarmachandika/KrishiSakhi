// import query_table from "../models/query_table.js";
import {queryActivityService} from "../services/summarize_log.js";

import { chatWithGemini } from "../services/gemini_service.js";
export const query_controller = async (req, res) => {
  try {
    const { farmer_id,crop_id, query } = req.body;
    if (!farmer_id || !query) {
      return res.status(400).json({ error: "farmer_id and query are required" });
    }   



    // // Save the query to the database
    // const newQuery = new query_table({
    //   farmer_id,
    //   crop_id,
    //   query,
    //   date: new Date(),
    // }); 

    // await newQuery.save();

    // Fetch relevant activity logs and get a summary

    

    const { status, matched_ids, results, summary } = await queryActivityService(farmer_id,crop_id, query);

    if (status !== 200) {
      return res.status(status).json({ error: summary || "Error processing query" });
    }   
    //store and feed thesummary to the gemini as context
    const history_context = `Here are some relevant history logs of the farmer:\n${summary}`;
    const weather_context = `The current weather condition is: "Sunny" with a temperature of 30°C and humidity of 60%. There is no rain forecasted for the next 3 days.`;

    const systemPrompt = `You are an expert agricultural assistant. Use the following context to answer the user's query:${query}.\n\n user actvity history:${history_context}\n\n currennt weather context:${weather_context}\n\nIf the context does not contain relevant information, answer based on your own knowledge. make sure it is brief and small not lengthy. If you don't know the answer, just say "I don't know". Do not make up an answer.`;

    const geminiResponse = await chatWithGemini(systemPrompt);
     res.json({ reply: geminiResponse });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }  
}; 


    

