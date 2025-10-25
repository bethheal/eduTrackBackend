// import dotenv from "dotenv";
// dotenv.config(); // ✅ Must come first

// import express from "express";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import connectDB from "./config/db.js";
// import authRoutes from "./routes/authRoutes.js";
// import subjectRoutes from "./routes/subjectRoutes.js";
// import profileRoutes from "./routes/profileRoutes.js";
// import { errorHandle } from "./Middleware/errorHandle.js";

// const PORT = process.env.PORT || 8080;

// const app = express();

// app.use(express.json());
// app.use(cookieParser());
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

// app.use("/api/auth", authRoutes);
// app.use("/api/subjects", subjectRoutes);
// app.use("/api/profile", profileRoutes);
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.use(errorHandle);

// app.listen(PORT, () => {
//   connectDB();
//   console.log(`Server Listening on ${PORT}`);
// });

import dotenv from "dotenv";
// dotenv.config(); // Must come first

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import { errorHandle } from "./middleware/errorHandle.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8000;
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/profile", profileRoutes);

// ✅ Static route for uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Error handler
app.use(errorHandle);

app.listen(PORT, () => {
  connectDB();
  console.log(`✅ Server listening on port ${PORT}`);
});
