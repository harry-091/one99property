import bcrypt from "bcryptjs";
import { pool, query } from "../src/config/db.js";

const email = process.env.ADMIN_EMAIL || "admin@one99properties.com";
const password = process.env.ADMIN_PASSWORD || "Admin@123";
const fullName = process.env.ADMIN_NAME || "System Admin";
const phone = process.env.ADMIN_PHONE || "9999999999";

const run = async () => {
  try {
    const existing = await query("SELECT id FROM users WHERE email = :email LIMIT 1", { email });
    const passwordHash = await bcrypt.hash(password, 10);

    if (existing.length) {
      await query(
        `UPDATE users
         SET password_hash = :passwordHash, role = 'admin', is_active = TRUE, updated_at = CURRENT_TIMESTAMP
         WHERE email = :email`,
        { email, passwordHash }
      );
      console.log(`Updated admin user: ${email}`);
    } else {
      await query(
        `INSERT INTO users (full_name, email, phone, password_hash, role, company_name)
         VALUES (:fullName, :email, :phone, :passwordHash, 'admin', 'One99 Properties')`,
        { fullName, email, phone, passwordHash }
      );
      console.log(`Created admin user: ${email}`);
    }

    console.log(`Password set to: ${password}`);
  } catch (error) {
    console.error("Failed to seed admin", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

run();
