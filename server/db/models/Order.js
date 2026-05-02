const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: String,
    name:      String,
    price:     Number,
    qty:       Number,
    lineTotal: Number,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId:       { type: String, required: true, unique: true }, // ORD-xxx
    userId:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userEmail:     String,
    userName:      String,
    items:         [orderItemSchema],
    address:       String,
    phone:         String,
    paymentMethod: String,
    subtotal:      Number,
    shipping:      Number,
    tax:           Number,
    total:         Number,
    status:        { type: String, default: "confirmed", enum: ["pending","confirmed","shipped","delivered","cancelled"] },
  },
  { timestamps: true }
);

orderSchema.virtual("id").get(function () {
  return this.orderId;
});

orderSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id        = ret.orderId;
    ret.createdAt = ret.createdAt?.toISOString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
