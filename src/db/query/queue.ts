import { query } from "../db";

// Add a url to queue
export const addToQueue = async (url: string) => {
  const sql = `
    INSERT INTO pages (url, status)
    VALUES ($1 , 'pending')
    ON CONFLICT (url) DO NOTHING
    `;
  await query(sql, [url]);
};

// Get a pending url form queue
export const getNextUrl = async () => {
  /**
   * Locks the row that one worker takes
   * @and
   * Skip the row that is already locked by other worker
   */
  const sql = `
    UPDATE pages
    SET status = 'processing'
    WHERE url = (
      SELECT url FROM pages
      WHERE status = 'pending'
      ORDER BY id ASC
      FOR UPDATE SKIP LOCKED
      LIMIT 1
    )
    RETURNING url
    `;
  const result = await query(sql);
  return result.rows[0]?.url || null;
};

// Mark the URL as Crawled
export const markAsCrawled = async (url: string, title: string) => {
  const sql = `
    UPDATE pages
    SET status = 'crawled', title = $2, last_crawled = NOW()
    WHERE url = $1
    `;
  await query(sql, [url, title]);
};
