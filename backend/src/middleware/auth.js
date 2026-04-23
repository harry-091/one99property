import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { query } from "../config/db.js";

export const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = header.split(" ")[1];
    const payload = jwt.verify(token, env.jwtSecret);
    const users = await query(
      "SELECT id, full_name, email, phone, role, is_active FROM users WHERE id = :id LIMIT 1",
      { id: payload.userId }
    );
    const user = users[0];

    if (!user || !user.is_active) {
      return res.status(401).json({ message: "User account is inactive" });
    }

    req.user = user;
    next();
  } catch (error) {
    next({ status: 401, message: "Invalid or expired token" });
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "You do not have permission to perform this action" });
  }
  next();
};

