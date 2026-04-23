import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../config/db.js";
import { env } from "../config/env.js";
import { ROLES } from "../utils/constants.js";

const signToken = (userId) => jwt.sign({ userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

export const registerUser = async ({ fullName, email, phone, password, companyName }) => {
  const existing = await query("SELECT id FROM users WHERE email = :email LIMIT 1", { email });
  if (existing.length) {
    throw { status: 409, message: "Email is already registered" };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const rows = await query(
    `INSERT INTO users (full_name, email, phone, password_hash, role, company_name)
     VALUES (:fullName, :email, :phone, :passwordHash, :role, :companyName)
     RETURNING id`,
    {
      fullName,
      email,
      phone,
      passwordHash,
      role: ROLES.CHANNEL_PARTNER,
      companyName
    }
  );
  const insertedUser = rows[0];

  const users = await query(
    "SELECT id, full_name, email, phone, role, company_name, is_active, created_at FROM users WHERE id = :id",
    { id: insertedUser.id }
  );
  const user = users[0];

  return { token: signToken(user.id), user };
};

export const loginUser = async ({ email, password }) => {
  const users = await query("SELECT * FROM users WHERE email = :email LIMIT 1", { email });
  const user = users[0];

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw { status: 401, message: "Invalid email or password" };
  }

  if (!user.is_active) {
    throw { status: 403, message: "Your account is inactive" };
  }

  return {
    token: signToken(user.id),
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      company_name: user.company_name
    }
  };
};
