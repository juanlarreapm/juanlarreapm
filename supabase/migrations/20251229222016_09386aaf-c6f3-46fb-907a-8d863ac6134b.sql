-- Create app_role enum for role-based access
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policy for user_roles: admins can manage, users can read their own
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create experiences table
CREATE TABLE public.experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    period TEXT NOT NULL,
    highlights TEXT[] NOT NULL DEFAULT '{}',
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Experiences are viewable by everyone"
ON public.experiences FOR SELECT USING (true);

CREATE POLICY "Admins can manage experiences"
ON public.experiences FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create toolkit_tools table
CREATE TABLE public.toolkit_tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    icon_name TEXT NOT NULL DEFAULT 'Wrench',
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.toolkit_tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tools are viewable by everyone"
ON public.toolkit_tools FOR SELECT USING (true);

CREATE POLICY "Admins can manage tools"
ON public.toolkit_tools FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create toolkit_methodologies table
CREATE TABLE public.toolkit_methodologies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    icon_name TEXT NOT NULL DEFAULT 'GitBranch',
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.toolkit_methodologies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Methodologies are viewable by everyone"
ON public.toolkit_methodologies FOR SELECT USING (true);

CREATE POLICY "Admins can manage methodologies"
ON public.toolkit_methodologies FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create toolkit_skills table
CREATE TABLE public.toolkit_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    icon_name TEXT NOT NULL DEFAULT 'Lightbulb',
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.toolkit_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Skills are viewable by everyone"
ON public.toolkit_skills FOR SELECT USING (true);

CREATE POLICY "Admins can manage skills"
ON public.toolkit_skills FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create projects table
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    description TEXT NOT NULL,
    metrics TEXT[] NOT NULL DEFAULT '{}',
    tags TEXT[] NOT NULL DEFAULT '{}',
    gradient TEXT DEFAULT 'from-primary to-accent',
    is_featured BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projects are viewable by everyone"
ON public.projects FOR SELECT USING (true);

CREATE POLICY "Admins can manage projects"
ON public.projects FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add update triggers for updated_at columns
CREATE TRIGGER update_experiences_updated_at
BEFORE UPDATE ON public.experiences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();