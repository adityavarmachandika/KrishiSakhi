import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


export const get_summary = async (textToSummarize) => {
  // LOG: Announce function start and log the input text
  console.log(`--- [get_summary] Service called ---`);
  console.log(`[get_summary] Input text length: ${textToSummarize?.length || 0}`);

  if (!textToSummarize || typeof textToSummarize !== 'string' || textToSummarize.trim() === '') {
    // LOG: Log the validation failure
    console.error('[get_summary] ERROR: Input validation failed. Text is empty or not a string.');
    throw new Error('Invalid input: A non-empty string is required for summarization.');
  }

  const prompt=`You are a helpful assistant for farmers. Summarize the provided text concisely in simple, easy-to-understand language. This is the text: ${textToSummarize} make sure it is consize`;
  try {
    const modelName = 'gemini-2.5-pro';
    const model = genAI.getGenerativeModel({
      model: modelName
    });
    
    const generationConfig = {
      maxOutputTokens: 300,
      temperature: 0.7,
    };

    // LOG: Log the model name before the API call
    console.log('[get_summary] INFO: Generating content with model:', modelName);

    // This now matches the exact structure of your working chatWithGemini function
    const result = await model.generateContent({
     contents: [{ parts: [{ text: prompt }] }],
    });

    const summary = result.response.text();
    // LOG: Log the raw response from the model before trimming
    console.log(`[get_summary] INFO: Raw response received from Gemini: "${summary}"`);
    
    return summary.trim();

  } catch (error) {
    // LOG: Log the full error object for detailed debugging
    console.error('[get_summary] FATAL: An error occurred during Gemini API call.');
    console.error(error); 
    throw new Error('Failed to get a summary from the model.');
  }
};


export const chatWithGemini = async (userMessage) => {
  // LOG: Announce function start and log the input message
  console.log(`--- [chatWithGemini] Service called ---`);
  console.log(`[chatWithGemini] Input message: "${userMessage}"`);

  if (!userMessage || typeof userMessage !== 'string' || userMessage.trim() === '') {
    // LOG: Log the validation failure
    console.error('[chatWithGemini] ERROR: Input validation failed. Message is empty or not a string.');
    throw new Error('Invalid input for chat');
  }

  try {
    const modelName = 'gemini-2.5-pro';
    const model = genAI.getGenerativeModel({ model: modelName });

    // LOG: Log the model name before the API call
    console.log('[chatWithGemini] INFO: Generating content with model:', modelName);

    const result = await model.generateContent({
      contents: [{ parts: [{ text: userMessage }] }]
    });

    const chatResponse = result.response.text();
    // LOG: Log the raw response from the model before trimming
    console.log(`[chatWithGemini] INFO: Raw response received from Gemini: "${chatResponse}"`);

    return chatResponse.trim();
  } catch (error) {
    // LOG: Log the full error object
    console.error('[chatWithGemini] FATAL: An error occurred during Gemini API call.');
    console.error(error);
    throw new Error('Failed to get chat response');
  }
};