// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // Make sure path is correct

const paymentRoutes = require("./routes/paymentRoutes"); // Make sure path is correct
const userRoutes = require("./routes/userRoutes");     // Make sure path is correct
const propertyRoutes = require("./routes/propertyRoutes"); // Make sure path is correct

const app = express(); // Create the Express app

// Connect to MongoDB
connectDB();

// Middlewares
const allowedOrigins = [];
if (process.env.CLIENT_URL_VERCEL) { // Use a different env var for Vercel's client
  allowedOrigins.push(process.env.CLIENT_URL_VERCEL);
}
if (process.env.NODE_ENV === 'development') {
  allowedOrigins.push("http://localhost:3000");
  allowedOrigins.push("http://localhost:5173");
}

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS Error: Origin ${origin} not allowed.`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));
app.use(express.json());

// API Routes
app.use("/api/payment", paymentRoutes);
app.use("/users", userRoutes);
app.use("/properties", propertyRoutes);

// Basic error handler
app.use((err, req, res, next) => {
  console.error("Error Timestamp:", new Date().toISOString());
  console.error("Request URL:", req.originalUrl);
  console.error("Request Method:", req.method);
  console.error(err.stack);
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).send('Not allowed by CORS');
  }
  res.status(500).send('Something broke!');
});

// --- Vercel does not use app.listen(). You export the app. ---
// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

module.exports = app; // Export the Express app for Vercel
