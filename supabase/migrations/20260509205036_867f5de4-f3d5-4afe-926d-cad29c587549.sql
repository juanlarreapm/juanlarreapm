
-- Move PM (PartsTech) under "PartsTech (acquired by OEC)"
UPDATE public.experiences
SET company_id = '0ad5e171-e062-415d-b8c1-8669870a0caa',
    company = 'PartsTech (acquired by OEC)',
    company_url = (SELECT url FROM public.companies WHERE id = '0ad5e171-e062-415d-b8c1-8669870a0caa')
WHERE id = '1d6f07b2-04e8-4bd3-a65d-297d5567d2ee';

DELETE FROM public.companies WHERE id = 'b38f5e50-f45a-4cdc-8b5f-83f803d0578f';

-- Move Business Analyst + Various Roles under the (acquired) Merchants entry
UPDATE public.experiences
SET company_id = '7e510a65-63b2-467a-8867-097dc8f22746',
    company = 'Merchants Preferred Lease Purchase Services (acquired by Rent-A-Center)',
    company_url = (SELECT url FROM public.companies WHERE id = '7e510a65-63b2-467a-8867-097dc8f22746')
WHERE id IN ('92ee408c-4618-41a8-9bdc-2df925e9fff7', 'b0b8c5d4-6f9c-4c58-8505-9cfa50826b92');

DELETE FROM public.companies WHERE id = '8f70b102-e6f3-45dc-96ca-c0f3b1b0bd30';
