import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import clientRoutes from "./routes/clientRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js"; 

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // support form-data for images

// Routes
app.use("/api/client", clientRoutes);
app.use("/api/hotel", hotelRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/reservation", reservationRoutes);

// Serve static files (optional, if you ever store local images)
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// MongoDB connection
// MongoDB connection
mongoose.connect(process.env.MONGO_URL) // remove options
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});