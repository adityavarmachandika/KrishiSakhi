import express from "express";
import cors from "cors";
import connectDB from "./config/db_connect.js";
import router from "./router.js";
import authMiddleware from "./middleware/jwt_middleware.js";
import { url } from "zod";
import { urlencoded } from "express";
// import './services/cron_notifications.js'



const app = express();
const PORT = 3000;



//database connection
connectDB()

app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use(cors())


app.use("/api", router);



app.get("/",(req, res) => {
  res.send("Backend is running 🚀");
});





app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
