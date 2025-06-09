// Import the express module
const express = require('express');
const mongoose  = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv")
dotenv.config();

const userRoutes = require("./Routes/UserRoutes.js");
const quizRoutes = require("./Routes/QuizRoutes.js");


// Create an instance of express
const app = express();
const PORT = process.env.PORT || 4999;
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

// Define a route for the root URL '/'
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Start the server and listen on port 3000
app.listen(3000, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
