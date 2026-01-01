-- Create lab_projects table
CREATE TABLE public.lab_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  cover_image TEXT,
  video_url TEXT,
  screenshots TEXT[] NOT NULL DEFAULT '{}'::text[],
  tech_stack TEXT[] NOT NULL DEFAULT '{}'::text[],
  demo_url TEXT,
  github_url TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  slug TEXT NOT NULL UNIQUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.lab_projects ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Published lab projects are viewable by everyone"
ON public.lab_projects
FOR SELECT
USING (published = true);

-- Create policy for admin management
CREATE POLICY "Admins can manage lab projects"
ON public.lab_projects
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_lab_projects_updated_at
BEFORE UPDATE ON public.lab_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for lab images
INSERT INTO storage.buckets (id, name, public) VALUES ('lab-images', 'lab-images', true);

-- Create storage policies for lab images
CREATE POLICY "Lab images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'lab-images');

CREATE POLICY "Admins can upload lab images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'lab-images' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update lab images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'lab-images' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete lab images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'lab-images' AND public.has_role(auth.uid(), 'admin'::app_role));