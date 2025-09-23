import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

export const get_summary = async (textToSummarize) => {

  if (!textToSummarize || typeof textToSummarize !== 'string' || textToSummarize.trim() === '') {
    throw new Error('Invalid input: A non-empty string is required for summarization.');
  }

  try {
 
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      systemInstruction: "You are a helpful assistant for farmers. Summarize the provided text concisely in simple, easy-to-understand language.",
    });
    
    const generationConfig = {
      maxOutputTokens: 300,
      temperature: 0.7,
    };


    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: textToSummarize }] }],
      generationConfig,
    });


    return result.response.text().trim();

  } catch (error) {

    console.error('Gemini Summarization Error:', error?.message || error);
    throw new Error('Failed to get a summary from the model.');
  }
};