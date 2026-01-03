-- Add visitor_id column to analytics_events for persistent visitor tracking
ALTER TABLE public.analytics_events 
ADD COLUMN visitor_id text;