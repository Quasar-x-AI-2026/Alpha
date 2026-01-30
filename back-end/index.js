import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./app/router/router.js";

dotenv.config();
connectDB();

const app = express();

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));

app.use(express.json());

app.use("/", router);

// Align with frontend default BASE_URL (http://localhost:8080)
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
