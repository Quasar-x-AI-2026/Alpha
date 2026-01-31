import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./app/router/router.js";

dotenv.config();
connectDB();

const app = express();

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
// Allow localhost dev origins on any port; keep credentials enabled
app.use(cors({
  origin: (origin, cb) => {
    // In dev, allow any localhost origin or configured client URL
    if (!origin) return cb(null, true);
    if (origin.startsWith("http://localhost") || origin === CLIENT_URL) {
      return cb(null, true);
    }
    return cb(null, false);
  },
  credentials: true,
}));

app.use(express.json());

app.use("/", router);

// Align with frontend default BASE_URL (http://localhost:8080)
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
