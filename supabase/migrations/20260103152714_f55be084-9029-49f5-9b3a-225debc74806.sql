-- Create table to store analytics snapshots
CREATE TABLE public.analytics_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_visitors INTEGER NOT NULL DEFAULT 0,
  total_pageviews INTEGER NOT NULL DEFAULT 0,
  avg_pages_per_visit NUMERIC(5,2) NOT NULL DEFAULT 0,
  avg_session_duration_seconds INTEGER NOT NULL DEFAULT 0,
  bounce_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
  top_pages JSONB NOT NULL DEFAULT '[]'::jsonb,
  traffic_sources JSONB NOT NULL DEFAULT '[]'::jsonb,
  devices JSONB NOT NULL DEFAULT '[]'::jsonb,
  countries JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(snapshot_date)
);

-- Enable RLS
ALTER TABLE public.analytics_snapshots ENABLE ROW LEVEL SECURITY;

-- Only admins can view analytics snapshots
CREATE POLICY "Admins can view analytics snapshots"
ON public.analytics_snapshots
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Service role can insert (for edge function)
CREATE POLICY "Service role can insert analytics snapshots"
ON public.analytics_snapshots
FOR INSERT
WITH CHECK (true);

-- Admins can delete old snapshots
CREATE POLICY "Admins can delete analytics snapshots"
ON public.analytics_snapshots
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Index for efficient date queries
CREATE INDEX idx_analytics_snapshots_date ON public.analytics_snapshots(snapshot_date DESC);