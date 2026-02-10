import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// Ensure these exist in your .env file
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("❌ MISSING SUPABASE CREDENTIALS IN .ENV");
}

// Create a single instance to reuse across the app
export const supabase = createClient(supabaseUrl, supabaseKey);
