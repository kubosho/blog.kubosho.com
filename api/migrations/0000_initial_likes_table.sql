-- Initial migration for likes table
-- Based on the design document requirements

CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  entry_id VARCHAR(255) NOT NULL,
  counts INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_entry_id ON likes (entry_id);
CREATE INDEX idx_created_at ON likes (created_at);