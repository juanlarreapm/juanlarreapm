ALTER TABLE public.companies ADD COLUMN description text;

-- Move PartsTech description from position to company
UPDATE public.companies
SET description = 'PartsTech is a next-generation parts ordering platform that helps automotive repair shops find the right parts and tires fast, connecting 25,000+ shops with 225+ suppliers across 30,000+ supplier locations through a unified search interface.'
WHERE id = '0ad5e171-e062-415d-b8c1-8669870a0caa';

UPDATE public.experiences
SET description = NULL
WHERE company_id = '0ad5e171-e062-415d-b8c1-8669870a0caa'
  AND description ILIKE 'PartsTech is a next-generation%';