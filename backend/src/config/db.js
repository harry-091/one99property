import pg from "pg";
import { env } from "./env.js";

const { Pool } = pg;

if (!env.db.connectionString) {
  throw new Error("Missing SUPABASE_DB_URL or DATABASE_URL in backend environment");
}

export const pool = new Pool({
  connectionString: env.db.connectionString,
  ssl: env.db.ssl ? { rejectUnauthorized: false } : false,
  max: 10
});

const toPgQuery = (sql, params) => {
  const values = [];
  const positions = new Map();

  const text = sql.replace(/(?<!:):([a-zA-Z_][a-zA-Z0-9_]*)/g, (_, key) => {
    if (!positions.has(key)) {
      positions.set(key, `$${values.length + 1}`);
      values.push(params[key] ?? null);
    }
    return positions.get(key);
  });

  return { text, values };
};

export const query = async (sql, params = {}) => {
  const { text, values } = toPgQuery(sql, params);
  const result = await pool.query(text, values);
  return result.rows;
};
