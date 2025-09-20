import express from 'express'
import cors from "cors"
import connectDB from './config/db.js';
import authRoutes from "./routes/authRoutes.js"
import { errorHandle } from "./Middleware/errorHandle.js";


const PORT = process.env.PORT || 8080;


const app = express();
app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use('/api/auth', authRoutes)

app.use(errorHandle)

app.listen(PORT, () =>{
    connectDB()
    console.log(`Server Listening on ${PORT}`);
})
