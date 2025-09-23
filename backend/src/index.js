import express from "express";
import cors from "cors";
import connectDB from "./config/db_connect.js";
import router from "./router.js";
import authMiddleware from "./middleware/jwt_middleware.js";
import vector_activity_routes from "./routes/vector_activity_routes.js";
import { url } from "zod";
import { urlencoded } from "express";
import activity_router from "./routes/activity_logining.js";


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

app.use("/test/vector",vector_activity_routes);
app.use("/test/activity",activity_router);



app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
