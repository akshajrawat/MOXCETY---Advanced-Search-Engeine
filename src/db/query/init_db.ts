import { query } from "../db";

const createTableQuery = `
CREATE TABLE IF NOT EXISTS pages (
  id SERIAL,
  url TEXT PRIMARY KEY,
  status TEXT DEFAULT 'pending',
  title TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_crawled TIMESTAMP
)
`;

const init = async () => {
  try {
    console.log("CREATING TABLE.....");
    await query(createTableQuery);
    console.log("TABLE CREATED SUCCESSFULLY ✅");
  } catch (error) {
    console.error("FAILED TO CREATE TABLE" + error);
    process.exit(1);
  }
};

init();
