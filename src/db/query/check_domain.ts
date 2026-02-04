import { query } from "../db";

const check = async () => {
  // SQL Magic: Extract the domain (host) from the URL and count them
  // This works in Postgres
  const sql = `
    SELECT 
      substring(url from 'https?://([^/]+)') as domain, 
      COUNT(*) as count 
    FROM pages 
    GROUP BY domain 
    ORDER BY count DESC 
    LIMIT 20;
  `;

  const res = await query(sql);
  console.table(res.rows);
  process.exit();
};

check();
