// cron-jobs.js
import cron from "node-cron";
import { create_message} from "./services/twilo.js"; 
import crop from "./models/crop.js";
import farmer from "./models/farmer.js";
import activity from "./models/activity.js";
import { get_summary, chatWithGemini } from "./services/gemini_service.js";

cron.schedule("0 */2 * * *", async () => {
  console.log("Running farmer notification job...");

  try {
    // 1️⃣ Fetch all farmers
    const farmers = await farmer.find();

    for (const f of farmers) {
      if (!f.contact) continue; // skip if no contact

      // 2️⃣ Fetch crops of this farmer
      const crops = await crop.find({ farmer_id: f._id });

      for (const c of crops) {
        // 3️⃣ Fetch recent activities
        const activities = await activity.find({ crop_id: c._id })
          .sort({ createdAt: -1 })
          .limit(10); // last 10 logs

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
Crop: ${c.crop_name}
Soil: ${c.soil_type}
Irrigation: ${c.irrigation_type}
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
Crop: ${c.crop_name}

Summary of recent activities:
${summary}

📌 Tasks for next 2 days:
${tasks}
        `;

        await create_message(f.contact, message.trim());
      }
    }

    console.log("✅ Farmer notifications sent successfully.");
  } catch (err) {
    console.error("❌ Error in notification job:", err);
  }
});
