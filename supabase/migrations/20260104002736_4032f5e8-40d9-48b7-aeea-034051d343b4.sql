-- Add project_date column to lab_projects table for custom display date
ALTER TABLE public.lab_projects 
ADD COLUMN project_date date DEFAULT CURRENT_DATE;