const mongoose = require("mongoose");

const resetTokenSchema = new mongoose.Schema({
  email:     { type: String, required: true },
  token:     { type: String, required: true, unique: true },
  expiresAt: { type: Date,   required: true },
});

// Auto-delete expired tokens
resetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.models.ResetToken || mongoose.model("ResetToken", resetTokenSchema);
