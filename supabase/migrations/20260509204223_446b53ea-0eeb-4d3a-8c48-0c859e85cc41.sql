
-- 1. Create companies table
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Companies are viewable by everyone"
  ON public.companies FOR SELECT USING (true);

CREATE POLICY "Admins can manage companies"
  ON public.companies FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Add company_id to experiences
ALTER TABLE public.experiences ADD COLUMN company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE;

-- 3. Backfill: create one company per distinct existing company name, link experiences
INSERT INTO public.companies (name, url, display_order)
SELECT company, MAX(company_url), MIN(display_order)
FROM public.experiences
GROUP BY company;

UPDATE public.experiences e
SET company_id = c.id
FROM public.companies c
WHERE c.name = e.company;

-- 4. Make company_id required going forward
ALTER TABLE public.experiences ALTER COLUMN company_id SET NOT NULL;
