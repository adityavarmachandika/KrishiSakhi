import fetch from "node-fetch";

const MAX_CHARS = 500;

/**
 * Splits text into chunks of <= MAX_CHARS each
 */
function splitText(text, maxLen = MAX_CHARS) {
  const parts = [];
  let current = "";

  for (const word of text.split(" ")) {
    if ((current + " " + word).trim().length > maxLen) {
      parts.push(current.trim());
      current = word;
    } else {
      current += " " + word;
    }
  }

  if (current) parts.push(current.trim());
  return parts;
}

/**
 * Calls MyMemory API to translate a single chunk
 */
async function translateChunk(chunk) {
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        chunk
      )}&langpair=en|ml`
    );

    const data = await response.json();

    if (data.responseData?.translatedText && data.responseData.translatedText !== "undefined") {
      return data.responseData.translatedText;
    } else if (data.matches && data.matches.length > 0) {
      return data.matches[0].translation;
    }

    return chunk; // fallback: return original if failed
  } catch (err) {
    console.error("Chunk translation error:", err);
    return chunk; // fallback
  }
}

/**
 * Translates long text (splits if >500 chars)
 */
export const translateToMalayalam = async (text) => {
  if (!text) return "";

  // Split into <=500 char chunks
  const chunks = splitText(text);

  // Translate each chunk in sequence
  const translatedChunks = [];
  for (const chunk of chunks) {
    const translated = await translateChunk(chunk);
    translatedChunks.push(translated);
  }

  // Recombine into single string
  return translatedChunks.join(" ");
};
