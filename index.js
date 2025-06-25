const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routers
const productRouter = require("./router/product.router");
const authRouter = require("./router/auth.router");

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI not found in .env");
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

mongoose.connection.on("error", err => {
  console.error("Mongoose error:", err);
});

// Routes
app.get("/", (req, res) => {
  res.send("Hello, server is running.");
});

app.use("/api/v1/product", productRouter);
app.use("/api/v1/auth", authRouter);

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
