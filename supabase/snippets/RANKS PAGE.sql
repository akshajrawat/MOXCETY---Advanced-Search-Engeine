UPDATE pages 
SET authority_score = ln(
  (SELECT count(*) FROM pages p2 WHERE pages.url = ANY(p2.links)) + 1
);