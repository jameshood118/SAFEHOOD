-- ==========================================
-- AUDIT 1: Verify all tables exist (Operating & Temporal)
-- ==========================================
SELECT 
  table_schema AS "Schema", 
  table_name AS "Table Name"
FROM information_schema.tables 
WHERE table_schema IN ('public', 'temporal') 
  AND table_type = 'BASE TABLE'
ORDER BY table_schema, table_name;

-- ==========================================
-- AUDIT 2: Verify the Triggers (The Wiring)
-- You should see both the 'updated_at' and 'temporal_shift' triggers for every table
-- ==========================================
SELECT 
  event_object_table AS "Target Table", 
  trigger_name AS "Trigger Name", 
  event_manipulation AS "Trigger Event"
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- ==========================================
-- AUDIT 3: Verify the Airlock (RLS Policies)
-- You should see the "Superadmin Sovereign Override" locked to your tables
-- ==========================================
SELECT 
  tablename AS "Protected Table", 
  policyname AS "Active Policy", 
  cmd AS "Allowed Action"
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;