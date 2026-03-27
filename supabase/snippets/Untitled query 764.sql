INSERT INTO public.interns (first_name, last_name, michael_scott_notes)
VALUES (
  'Ryan', 
  'Howard', 
  '{
    "strengths": ["Business School", "Makes a decent pitch"],
    "weaknesses": ["Started the fire", "Defrauded the company"],
    "do_not_trust_with": "The cheese pita toaster"
  }'::jsonb
);