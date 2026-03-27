CREATE TABLE base_camp_intel (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- The Raw Dump
  raw_content TEXT NOT NULL,
  
  -- Metadata
  content_type TEXT DEFAULT 'UNSTRUCTURED', -- TEXT, LINK, CODE_SNIPPET
  status TEXT DEFAULT 'QUARANTINE', -- QUARANTINE, DISPATCHED
  
  -- Security
  is_deleted BOOLEAN DEFAULT false
);

ALTER TABLE base_camp_intel ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full access to authenticated users" ON base_camp_intel FOR ALL TO authenticated USING (true);