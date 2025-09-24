// WHatsaap_message.js
import axios from "axios";

const API_KEY = process.env.WHATSAAP_API_KEY;

export default async function sendTemplateMessage(to, bodyText) {
    to=to+"91"  // Adding country code for India
  try {
    const response = await axios({
      method: "post",
      url: "https://graph.facebook.com/v22.0/824266307430084/messages",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        messaging_product: "whatsapp",
        to, // ✅ dynamic farmer phone
        type: "text", // if you want to send plain text
        text: { body: bodyText },
      }),
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error("❌ WhatsApp send error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}
