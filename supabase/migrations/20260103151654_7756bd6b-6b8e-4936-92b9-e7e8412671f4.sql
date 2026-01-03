-- Create analytics_events table for custom event tracking
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  page_path TEXT,
  session_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Anyone can insert events (anonymous tracking)
CREATE POLICY "Anyone can insert analytics events"
ON public.analytics_events
FOR INSERT
WITH CHECK (true);

-- Only admins can view analytics
CREATE POLICY "Admins can view analytics events"
ON public.analytics_events
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete analytics
CREATE POLICY "Admins can delete analytics events"
ON public.analytics_events
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for efficient querying
CREATE INDEX idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX idx_analytics_events_created ON public.analytics_events(created_at DESC);