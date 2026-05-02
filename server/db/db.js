/**
 * Database abstraction layer.
 * Uses MongoDB (via Mongoose) when MONGODB_URI is set and connected.
 * Falls back to JSON file database automatically — zero config needed.
 */

const fs   = require("fs");
const path = require("path");
const { isMongoConnected } = require("./connection");

// ─── JSON file fallback ───────────────────────────────────────
const DB_PATH = path.join(__dirname, "data.json");
const seed    = { users: [], orders: [], resetTokens: [] };

if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2));
}

const readJSON = () => {
  try { return JSON.parse(fs.readFileSync(DB_PATH, "utf8")); }
  catch { return { ...seed }; }
};

const writeJSON = (data) =>
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// ─── Mongoose models (loaded lazily so JSON fallback still works) ─
const getModels = () => ({
  User:       require("./models/User"),
  Order:      require("./models/Order"),
  ResetToken: require("./models/ResetToken"),
});

// ─── Users ───────────────────────────────────────────────────
const findUserByEmail = async (email) => {
  if (isMongoConnected()) {
    const { User } = getModels();
    // Use .select('+password') to explicitly include the password field
    const u = await User.findOne({ email: email.toLowerCase() }).select('+password').lean();
    if (!u) return null;
    return { ...u, id: u._id.toString() };
  }
  const db = readJSON();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
};

const findUserById = async (id) => {
  if (isMongoConnected()) {
    const { User } = getModels();
    try {
      const u = await User.findById(id).select('+password').lean();
      if (!u) return null;
      return { ...u, id: u._id.toString() };
    } catch { return null; }
  }
  const db = readJSON();
  return db.users.find((u) => u.id === id) || null;
};

const createUser = async (user) => {
  if (isMongoConnected()) {
    const { User } = getModels();
    const doc = await User.create({
      firstName: user.firstName,
      lastName:  user.lastName,
      name:      user.name,
      email:     user.email,
      phone:     user.phone || "",
      password:  user.password,
    });
    return { ...doc.toObject(), id: doc._id.toString(), password: doc.password };
  }
  const db = readJSON();
  db.users.push(user);
  writeJSON(db);
  return user;
};

const updateUser = async (id, updates) => {
  if (isMongoConnected()) {
    const { User } = getModels();
    try {
      const doc = await User.findByIdAndUpdate(id, updates, { new: true }).lean();
      if (!doc) return null;
      return { ...doc, id: doc._id.toString() };
    } catch { return null; }
  }
  const db = readJSON();
  const idx = db.users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  db.users[idx] = { ...db.users[idx], ...updates };
  writeJSON(db);
  return db.users[idx];
};

// ─── Orders ──────────────────────────────────────────────────
const createOrder = async (order) => {
  if (isMongoConnected()) {
    const { Order } = getModels();
    const doc = await Order.create({
      orderId:       order.id,
      userId:        order.userId,
      userEmail:     order.userEmail,
      userName:      order.userName,
      items:         order.items,
      address:       order.address,
      phone:         order.phone,
      paymentMethod: order.paymentMethod,
      subtotal:      order.subtotal,
      shipping:      order.shipping,
      tax:           order.tax,
      total:         order.total,
      status:        order.status || "confirmed",
    });
    return _formatOrder(doc.toObject());
  }
  const db = readJSON();
  db.orders.push(order);
  writeJSON(db);
  return order;
};

const getOrdersByUser = async (userId) => {
  if (isMongoConnected()) {
    const { Order } = getModels();
    const docs = await Order.find({ userId }).sort({ createdAt: -1 }).lean();
    return docs.map(_formatOrder);
  }
  const db = readJSON();
  return db.orders.filter((o) => o.userId === userId);
};

const getOrderById = async (orderId) => {
  if (isMongoConnected()) {
    const { Order } = getModels();
    const doc = await Order.findOne({ orderId }).lean();
    return doc ? _formatOrder(doc) : null;
  }
  const db = readJSON();
  return db.orders.find((o) => o.id === orderId) || null;
};

const _formatOrder = (doc) => ({
  ...doc,
  id:        doc.orderId,
  userId:    doc.userId?.toString(),
  createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
});

// ─── Reset Tokens ─────────────────────────────────────────────
const saveResetToken = async (email, token, expiresAt) => {
  if (isMongoConnected()) {
    const { ResetToken } = getModels();
    await ResetToken.deleteMany({ email });
    await ResetToken.create({ email, token, expiresAt: new Date(expiresAt) });
    return;
  }
  const db = readJSON();
  db.resetTokens = db.resetTokens.filter((t) => t.email !== email);
  db.resetTokens.push({ email, token, expiresAt });
  writeJSON(db);
};

const findResetToken = async (token) => {
  if (isMongoConnected()) {
    const { ResetToken } = getModels();
    return await ResetToken.findOne({ token }).lean();
  }
  const db = readJSON();
  return db.resetTokens.find((t) => t.token === token) || null;
};

const deleteResetToken = async (token) => {
  if (isMongoConnected()) {
    const { ResetToken } = getModels();
    await ResetToken.deleteOne({ token });
    return;
  }
  const db = readJSON();
  db.resetTokens = db.resetTokens.filter((t) => t.token !== token);
  writeJSON(db);
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  createOrder,
  getOrdersByUser,
  getOrderById,
  saveResetToken,
  findResetToken,
  deleteResetToken,
};
