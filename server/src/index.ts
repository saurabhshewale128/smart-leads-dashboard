import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import leadRoutes from "./routes/leadRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


// Routes
app.use("/api/leads", leadRoutes);

app.use("/api/auth", authRoutes);


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("MongoDB Connected ✅");
  })
  .catch((error) => {
    console.log(error);
  });


// Test Route
app.get("/", (req, res) => {
  res.send("Server Running 🚀");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});