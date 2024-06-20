import express from "express";
import bcrypt from "bcryptjs"
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true, // Enable the Access-Control-Allow-Credentials header
};

const app = express();
app.use(cors(corsOptions));
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import notificationRoutes from './routes/notification.routes.js'
import { connectMongoDB } from "./db/connectMDB.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

cloudinary.config({
    cloud_name:"dxgcq5wuz",
    api_key:177518487565398 ,
    api_secret:"ZLcFwu0QGZsbsRzz-jkC85cRr24",
    
})


app.use(express.json({limit:"5mb"})); //parse the req.body
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/posts",postRoutes);
app.use('/api/notifications',notificationRoutes)

app.listen(8000,()=>{
    console.log("server is running");
    connectMongoDB();
})