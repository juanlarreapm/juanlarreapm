-- Allow admins to delete contact submissions
CREATE POLICY "Admins can delete contact submissions" 
ON contact_submissions 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));