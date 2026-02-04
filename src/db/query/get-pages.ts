import { query } from "../db";

export const getPages = async (keyword: string, offset: number) => {
  const sql = `
    SELECT title, url, last_crawled, ts_rank(to_tsvector('english', title), plainto_tsquery('english', $1)) as rank
    FROM pages
    WHERE status = 'crawled'
    AND (
      to_tsvector('english', title) @@ plainto_tsquery('english', $1)
      OR 
      url ILIKE $2
    )
    ORDER BY rank DESC
    LIMIT 10
    OFFSET $3
    `;
  const result = await query(sql, [keyword, `%${keyword}%`, offset]);
  return result.rows;
};
