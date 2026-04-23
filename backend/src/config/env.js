import dotenv from "dotenv";

dotenv.config({ path: ".env" });

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env.local", override: true });
}

export const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrls: (process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
  jwtSecret: process.env.JWT_SECRET || "change_me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  db: {
    connectionString: process.env.SUPABASE_DB_URL || process.env.DATABASE_URL || "",
    ssl: (process.env.SUPABASE_DB_SSL || "true").toLowerCase() === "true"
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM || "no-reply@one99properties.com"
  }
};
