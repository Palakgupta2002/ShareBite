import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser"
import dotenv from 'dotenv';
import cors from "cors"
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import claimRoutes from "./routes/claimRoutes.js";
dotenv.config();


mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('✅ MongoDB connected successfully');
}).catch((error) => {
  console.error('❌ MongoDB connection error:', error);
});

const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/claims", claimRoutes);

// Register your postRoutes under /api/posts
app.use("/api/posts", postRoutes);


app.get('/', (req, res) => {
    res.json({ message: "Welcome to Food share Website." });
});

app.listen(5000, () => {
    console.log(`App listening on port 5000`);
});