import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: "localhost",
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
});

// 3. Export a query helper
// This is a "wrapper" so we can log queries if we want later
export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

// Test the connection immediately
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Database Connection Failed:", err);
  } else {
    console.log("✅ Database Connected at:", res.rows[0].now);
  }
});
