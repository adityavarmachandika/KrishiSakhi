// twilo.js
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function createMessage(body, phone_number) {

  try {
    const message = await client.messages.create({
      body,
      from: "+12203008551",
      to: fullNumber,
    });

    console.log(`✅ SMS sent to ${fullNumber}: ${message.sid}`);
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error(`❌ Failed to send SMS to ${fullNumber}:`, error.message || error);
    // Return the error instead of throwing, so the caller can handle it
    return { success: false, error };
  }
}
