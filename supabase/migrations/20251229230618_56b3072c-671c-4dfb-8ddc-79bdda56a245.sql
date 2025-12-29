-- Create site_settings table for storing resume and other site-wide settings
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read site settings
CREATE POLICY "Site settings are viewable by everyone"
ON public.site_settings
FOR SELECT
USING (true);

-- Only admins can manage site settings
CREATE POLICY "Admins can manage site settings"
ON public.site_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', true);

-- Storage policies for resume bucket
CREATE POLICY "Resume files are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'resumes');

CREATE POLICY "Admins can upload resumes"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'resumes' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update resumes"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'resumes' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete resumes"
ON storage.objects
FOR DELETE
USING (bucket_id = 'resumes' AND has_role(auth.uid(), 'admin'));