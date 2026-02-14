DROP FUNCTION IF EXISTS search_pages;

CREATE OR REPLACE FUNCTION search_pages(
  keyword text,
  match_threshold float default 0.1,
  page_offset int default 0
)
returns table (
  id bigint,
  url text,
  title text,
  rank float
)
language sql
as $$
  SELECT 
    id, 
    url, 
    title, 
    (
      -- SIGNAL 1: Relevance (The Base Score)
      -- We still trust the Title ('A') more than the URL ('B')
      ts_rank(
        setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(url, '')), 'B'),
        plainto_tsquery('english', keyword)
      ) 
      
      -- SIGNAL 2: Authority (The "Trust" Boost)
      -- We multiply by 0.3. This ensures a "popular" page (Score 5.0) 
      -- gets a nice boost (+1.5), but doesn't totally override relevance.
      + (coalesce(authority_score, 0) * 0.3)

      -- SIGNAL 3: Navigational (The "Wikipedia Rule")
      -- Exact Match on Title still gets the massive "Golden Ticket" (+10)
      + (CASE WHEN lower(title) = lower(keyword) THEN 10.0 ELSE 0.0 END)
    ) as rank
  FROM pages
  WHERE status = 'crawled'
  AND (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(url, '')) @@ plainto_tsquery('english', keyword)
  )
  ORDER BY rank DESC
  LIMIT 10
  OFFSET page_offset;
$$;