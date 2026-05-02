const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn("\n⚠️  MONGODB_URI not set — falling back to JSON file database.");
    console.warn("   To use MongoDB Atlas:");
    console.warn("   1. Go to https://cloud.mongodb.com → create free cluster");
    console.warn("   2. Get connection string → paste as MONGODB_URI in server/.env\n");
    return;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      family: 4, // force IPv4 — fixes issues on networks with broken IPv6 DNS
    });
    isConnected = true;
    console.log("✅  MongoDB Atlas connected.");
  } catch (err) {
    console.error("❌  MongoDB connection failed:", err.message);
    console.warn("   Falling back to JSON file database.\n");
  }
};

const isMongoConnected = () => isConnected;

module.exports = { connectDB, isMongoConnected };
