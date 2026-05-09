-- Drop existing tables
DROP TABLE IF EXISTS hero_follows CASCADE;
DROP TABLE IF EXISTS hero_follow_counts CASCADE;

-- Create hero_follows table with correct types
CREATE TABLE hero_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  hero_slug TEXT NOT NULL,
  hero_name TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create unique index
CREATE UNIQUE INDEX user_hero_idx ON hero_follows(user_id, hero_slug);

-- Create hero_follow_counts table
CREATE TABLE hero_follow_counts (
  hero_slug TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
