import app from "./app.js";
import { env } from "./config/env.js";
import { pool } from "./config/db.js";

const start = async () => {
  try {
    await pool.query("SELECT 1");
    app.listen(env.port, () => {
      console.log(`One99 Properties API listening on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

start();
