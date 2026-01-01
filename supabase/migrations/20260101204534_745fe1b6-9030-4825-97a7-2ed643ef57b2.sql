-- Add new columns to projects table for case study content
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS slug text UNIQUE,
ADD COLUMN IF NOT EXISTS industry text,
ADD COLUMN IF NOT EXISTS role text,
ADD COLUMN IF NOT EXISTS duration text,
ADD COLUMN IF NOT EXISTS cover_image text,
ADD COLUMN IF NOT EXISTS problem text,
ADD COLUMN IF NOT EXISTS approach text,
ADD COLUMN IF NOT EXISTS solution text,
ADD COLUMN IF NOT EXISTS outcome text,
ADD COLUMN IF NOT EXISTS team_composition text[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS tools_used text[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS published boolean DEFAULT true;

-- Create storage bucket for case study images
INSERT INTO storage.buckets (id, name, public)
VALUES ('case-study-images', 'case-study-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for case study images
CREATE POLICY "Case study images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'case-study-images');

CREATE POLICY "Admins can upload case study images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'case-study-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update case study images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'case-study-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete case study images"
ON storage.objects FOR DELETE
USING (bucket_id = 'case-study-images' AND has_role(auth.uid(), 'admin'::app_role));