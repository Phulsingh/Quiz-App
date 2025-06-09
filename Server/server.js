const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
dotenv.config();

const userRoutes = require("./Routes/UserRoutes.js");
const quizRoutes = require("./Routes/QuizRoutes.js");

const app = express();
const PORT = 4000;
const MONGO_URI  = process.env.MONGO_URI


// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/quiz", quizRoutes);


mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Define a basic route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
