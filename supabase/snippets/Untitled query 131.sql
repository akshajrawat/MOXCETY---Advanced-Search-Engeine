-- 1. We define the function name and the input (the vector from Node.js)
CREATE OR REPLACE FUNCTION match_code_snippets (
  query_embedding vector(384), -- Must be 384 to match your AI model
  match_threshold float DEFAULT 0.5, -- Filter out low-quality matches
  page_offset int DEFAULT 0 -- How many results to return
)
RETURNS TABLE (
  id bigint,
  content text,
  language text,
  page_url text, -- We will join this from the pages table
  page_title text,
  similarity float -- How close the AI thinks the match is
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    cs.id,
    cs.content,
    cs.language,
    p.url AS page_url,
    p.title AS page_title,
    -- The <=> symbol calculates "Distance". 
    -- (1 - Distance) gives us "Similarity" (1.0 is a perfect match)
    1 - (cs.embedding <=> query_embedding) AS similarity
  FROM code_snippets cs
  -- Join with the pages table so we know which website the code came from
  JOIN pages p ON cs.page_id = p.id
  -- Only show results that are close enough to our search
  WHERE 1 - (cs.embedding <=> query_embedding) > match_threshold
  -- Sort by best match first
  ORDER BY similarity DESC
  LIMIT 10;
END;
$$;