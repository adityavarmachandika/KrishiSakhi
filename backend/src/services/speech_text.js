import fetch from "node-fetch";
import FormData from "form-data";

/**
 * Receives an Express request, extracts audio from it, and returns transcription
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
export async function transcribeRequestAudio(req, res) {
  if (!req.file || !req.file.buffer) {
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    return res.status(400).json({ error: "No audio file provided" });
  }

  console.log(req.file);
  try {
    // Build form-data payload for AssemblyAI
    const formData = new FormData();
    formData.append("audio", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // Upload audio to AssemblyAI
    const uploadResponse = await fetch("https://api.assemblyai.com/v2/upload", {
      method: "POST",
      headers: {
        "authorization": process.env.ASSEMBLYAI_API_KEY,
      },
      body: req.file.buffer,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error("AssemblyAI upload error:", uploadResponse.status, uploadResponse.statusText, errorText);
      return res.status(uploadResponse.status).json({ error: `AssemblyAI upload error: ${uploadResponse.statusText}`, details: errorText });
    }

    const uploadData = await uploadResponse.json();
    const audio_url = uploadData.upload_url;

    // Request transcription
    const transcriptResponse = await fetch("https://api.assemblyai.com/v2/transcript", {
      method: "POST",
      headers: {
        "authorization": process.env.ASSEMBLYAI_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({ audio_url }),
    });

    if (!transcriptResponse.ok) {
      const errorText = await transcriptResponse.text();
      console.error("AssemblyAI transcript error:", transcriptResponse.status, transcriptResponse.statusText, errorText);
      return res.status(transcriptResponse.status).json({ error: `AssemblyAI transcript error: ${transcriptResponse.statusText}`, details: errorText });
    }

    const transcriptData = await transcriptResponse.json();
    const transcriptId = transcriptData.id;

    // Poll for transcription completion
    let completed = false;
    let transcriptText = "";
    for (let i = 0; i < 20; i++) { // Poll up to 20 times
      await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
      const pollingResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
        method: "GET",
        headers: {
          "authorization": process.env.ASSEMBLYAI_API_KEY,
        },
      });
      const pollingData = await pollingResponse.json();
      if (pollingData.status === "completed") {
        completed = true;
        transcriptText = pollingData.text;
        break;
      } else if (pollingData.status === "failed") {
        return res.status(500).json({ error: "Transcription failed", details: pollingData.error });
      }
    }

    if (!completed) {
      return res.status(202).json({ error: "Transcription still processing, try again later." });
    }

    res.json({ text: transcriptText });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}