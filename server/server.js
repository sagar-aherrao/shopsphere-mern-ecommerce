import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";

import adminRoutes from "./routes/adminRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();

// ======================================
// DATABASE
// ======================================
connectDB();

// ======================================
// MIDDLEWARE
// ======================================
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================================
// DEBUG BODY
// ======================================
app.use((req, res, next) => {
  console.log("================================");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("Content-Type:", req.headers["content-type"]);
  console.log("Body:", req.body);
  console.log("================================");

  next();
});

// ======================================
// ROUTES
// ======================================
app.use("/api/auth", authRoutes);

// ======================================
// TEST
// ======================================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ShopSphere API is running",
  });
});

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);
app.use("/api/admin", adminRoutes);
// ======================================
// SERVER
// ======================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});