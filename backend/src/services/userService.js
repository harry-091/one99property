import bcrypt from "bcryptjs";
import { query } from "../config/db.js";

export const listUsers = async () =>
  query(
    `SELECT id, full_name, email, phone, role, company_name, is_active, created_at
     FROM users
     ORDER BY created_at DESC`
  );

export const createUser = async ({ fullName, email, phone, password, role, companyName }) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const rows = await query(
    `INSERT INTO users (full_name, email, phone, password_hash, role, company_name)
     VALUES (:fullName, :email, :phone, :passwordHash, :role, :companyName)
     RETURNING id`,
    { fullName, email, phone, passwordHash, role, companyName }
  );
  const insertedUser = rows[0];

  const users = await query(
    `SELECT id, full_name, email, phone, role, company_name, is_active, created_at
     FROM users WHERE id = :id`,
    { id: insertedUser.id }
  );

  return users[0];
};

export const updateUser = async (id, payload) => {
  await query(
    `UPDATE users
     SET full_name = COALESCE(:fullName, full_name),
         phone = COALESCE(:phone, phone),
         role = COALESCE(:role, role),
         company_name = COALESCE(:companyName, company_name),
         is_active = COALESCE(:isActive, is_active),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = :id`,
    { id, ...payload }
  );

  const users = await query(
    `SELECT id, full_name, email, phone, role, company_name, is_active, created_at
     FROM users WHERE id = :id`,
    { id }
  );

  return users[0];
};

export const deleteUser = async (id) => {
  await query("DELETE FROM users WHERE id = :id", { id });
  return { success: true };
};
