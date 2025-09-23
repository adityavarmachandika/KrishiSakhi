import twilio from "twilio"
import dotenv from  'dotenv';


dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function create_message(body, phone_number) {

    phone_number= "+91"+phone_number
    console.log(accountSid,authToken)
  const message = await client.messages.create({
    body: body,
    from:"+12203008551",
    to: phone_number,
  });
  console.log(message.body);
  res.json({"body":message.body})
}
