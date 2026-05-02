const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },
    name:      { type: String, required: true },
    email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone:     { type: String, default: "" },
    password:  { type: String, required: true, select: false },
  },
  { timestamps: true }
);

// Virtual id field to match JSON db shape
userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password; // never expose password in JSON output
    return ret;
  },
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
