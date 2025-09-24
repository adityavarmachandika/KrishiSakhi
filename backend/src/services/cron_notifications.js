// cron-jobs.js
import cron from "node-cron";
import {create_message}  from "./twilo.js";
import { crop } from "../models/crop.js";
import { farmer_details } from "../models/farmer.js";
import { activity } from "../models/activity.js";
import { get_summary, chatWithGemini } from "./gemini_service.js";

// Runs every 2 hours for MVP
cron.schedule("* * * * *", async () => {
  console.log("Running farmer notification job...");

  try {
    // 1️⃣ Fetch all farmers
    const farmers = await farmer_details.find({});

    for (const f of farmers) {
      if (!f.phone) continue; // skip if no contact

      // 2️⃣ Fetch crops of this farmer
      const crops = await crop.find({ farmer_id: f._id });

      for (const c of crops) {
        try {
          // 3️⃣ Fetch recent activities for this crop
          const activities = await activity.find({ crop_id: c._id })
            .sort({ createdAt: -1 })
            .limit(10);

          // 4️⃣ Combine activity text for summarization
          const activityText = activities
            .map(a => `• ${a.log} (Condition: ${a.crop_condition})`)
            .join("\n");

          // 5️⃣ Summarize activities (concise per crop)
          const summary = activityText
            ? await get_summary(activityText)
            : "No recent activities recorded.";

          // 6️⃣ Prepare crop condition text
          const cropCondition = `
Crop: ${c.crop_name || "N/A"}
Soil: ${c.soil_type || "N/A"}
Irrigation: ${c.irrigation_type || "N/A"}
          `;

          // 7️⃣ Prepare prompt for Gemini to get next 1–2 day tasks
          const prompt = `
Here is the crop condition and recent activity summary:
${cropCondition}
Activity Summary:
${summary}

Suggest 1–2 practical farming tasks for the next 2 days in simple language for the farmer.
          `;

          const tasks = await chatWithGemini(prompt);

          // 8️⃣ Final personalized SMS
          const message = `
Hello ${f.name || "Farmer"},
Crop: ${c.crop_name || "N/A"}

Summary of recent activities:
${summary}

📌 Tasks for next 2 days:
${tasks}
          `;

          // 9️⃣ Send SMS safely
          const smsResult = await create_message(message.trim(), "9989469228");
          if (!smsResult.success) {
            if (smsResult.error?.code === 21608) {
              console.warn(`⚠️ Skipping unverified number ${f.phone}`);
            } else {
              console.error(`❌ Failed to send SMS to ${f.phone}:y
                `, smsResult.error.message);
            }
            // Continue to next crop/farmer even if SMS fails
          }

        } catch (cropErr) {
          console.error(`❌ Error processing crop ${c._id} for farmer ${f._id}:`, cropErr.message);
        }
      }
    }

    console.log("✅ Farmer notifications job completed successfully.");
  } catch (err) {
    console.error("❌ Error in notification job:", err.message || err);
  }
});
