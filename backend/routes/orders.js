const express = require("express");
const crypto  = require("crypto");
const { body, validationResult } = require("express-validator");

const db      = require("../db/db");
const { protect } = require("../middleware/auth");
const { sendOrderConfirmationEmail } = require("../utils/email");

const router = express.Router();

/* ── Wrap async handlers ── */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ── Product catalogue (static for now, replace with DB later) ── */
const PRODUCTS = [
  { id: "p1", name: "Interior Accessories Kit",      price: 49.99,  category: "Interior" },
  { id: "p2", name: "Premium Car Mats (Red & Black)", price: 34.99,  category: "Interior" },
  { id: "p3", name: "Full Car Cover",                 price: 79.99,  category: "Exterior" },
  { id: "p4", name: "Interior Renovation Spray",      price: 19.99,  category: "Interior" },
  { id: "p5", name: "Chrome Rims Set (4)",             price: 299.99, category: "Wheels"   },
  { id: "p6", name: "Premium Leather Seat Covers",    price: 129.99, category: "Interior" },
  { id: "p7", name: "Ambient LED Interior Lights",    price: 44.99,  category: "Electronics" },
  { id: "p8", name: "Car Armrest Organizer",           price: 24.99,  category: "Interior" },
];

const SHIPPING_THRESHOLD = 100; // free shipping above this
const TAX_RATE = 0.08;

/* ─────────────────────────────────────────
   GET /api/orders/products
   Public — returns product catalogue
───────────────────────────────────────── */
router.get("/products", (req, res) => {
  res.json({ success: true, products: PRODUCTS });
});

/* ─────────────────────────────────────────
   POST /api/orders
   Protected — place a new order
───────────────────────────────────────── */
router.post(
  "/",
  protect,
  [
    body("items").isArray({ min: 1 }).withMessage("Order must contain at least one item"),
    body("items.*.productId").notEmpty().withMessage("Each item needs a productId"),
    body("items.*.qty").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
    body("address").trim().notEmpty().withMessage("Delivery address is required"),
    body("paymentMethod").trim().notEmpty().withMessage("Payment method is required"),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { items, address, paymentMethod, phone } = req.body;

    // Resolve products and calculate totals
    const resolvedItems = [];
    for (const item of items) {
      const product = PRODUCTS.find((p) => p.id === item.productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product "${item.productId}" not found.`,
        });
      }
      resolvedItems.push({
        productId: product.id,
        name:      product.name,
        price:     product.price,
        qty:       item.qty,
        lineTotal: +(product.price * item.qty).toFixed(2),
      });
    }

    const subtotal = +resolvedItems.reduce((s, i) => s + i.lineTotal, 0).toFixed(2);
    const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : 9.99;
    const tax      = +(subtotal * TAX_RATE).toFixed(2);
    const total    = +(subtotal + shipping + tax).toFixed(2);

    const order = await db.createOrder({
      id:            `ORD-${Date.now()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`,
      userId:        req.user.id,
      userEmail:     req.user.email,
      userName:      req.user.name,
      items:         resolvedItems,
      address,
      phone:         phone || req.user.phone || "",
      paymentMethod,
      subtotal,
      shipping,
      tax,
      total,
      status:        "confirmed",
      createdAt:     new Date().toISOString(),
    });

    // Fire-and-forget — respond immediately, email in background
    sendOrderConfirmationEmail({
      to:    req.user.email,
      name:  req.user.name,
      order,
    }).catch((err) => console.error("Order email failed:", err.message));

    res.status(201).json({
      success: true,
      message: "Order placed successfully! A confirmation email has been sent.",
      order,
    });
  })
);

/* ─────────────────────────────────────────
   GET /api/orders
   Protected — get current user's orders
───────────────────────────────────────── */
router.get("/", protect, asyncHandler(async (req, res) => {
  const orders = await db.getOrdersByUser(req.user.id);
  res.json({ success: true, orders });
}));

/* ─────────────────────────────────────────
   GET /api/orders/:id
   Protected — get single order
───────────────────────────────────────── */
router.get("/:id", protect, asyncHandler(async (req, res) => {
  const order = await db.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found." });
  }
  if (order.userId !== req.user.id) {
    return res.status(403).json({ success: false, message: "Access denied." });
  }
  res.json({ success: true, order });
}));

module.exports = router;
