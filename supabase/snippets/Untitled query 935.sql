-- PUNCHING A TEMPORARY HOLE IN THE AIRLOCK FOR DEV VISIBILITY
CREATE POLICY "Dev Mode: Public Read Interns" ON public.interns
FOR SELECT
TO anon, authenticated
USING (true);