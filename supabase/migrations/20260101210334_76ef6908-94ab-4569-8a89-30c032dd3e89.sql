-- Add new case study section columns
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS execution_collaboration text,
ADD COLUMN IF NOT EXISTS impact_results text,
ADD COLUMN IF NOT EXISTS reflections text;