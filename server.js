import dotenv from 'dotenv';
dotenv.config(); // ✅ Must come first

import express from 'express';
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from './config/db.js';
import authRoutes from "./routes/authRoutes.js";
import { errorHandle } from "./Middleware/errorHandle.js";

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use('/api/auth', authRoutes);

app.use(errorHandle);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server Listening on ${PORT}`);
});
