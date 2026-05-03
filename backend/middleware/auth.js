const { verifyToken } = require("../utils/jwt");
const db = require("../db/db");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Not authenticated. Please sign in." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Invalid or expired token. Please sign in again." });
    }

    const user = await db.findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User no longer exists." });
    }

    // Attach user to request (exclude password)
    const { password: _, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { protect };
