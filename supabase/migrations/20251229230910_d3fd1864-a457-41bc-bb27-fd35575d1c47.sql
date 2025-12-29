-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-photos', 'profile-photos', true);

-- Create policy for public read access to profile photos
CREATE POLICY "Profile photos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-photos');

-- Create policy for admin upload access to profile photos
CREATE POLICY "Admins can upload profile photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'profile-photos' AND has_role(auth.uid(), 'admin'::app_role));

-- Create policy for admin update access to profile photos
CREATE POLICY "Admins can update profile photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'profile-photos' AND has_role(auth.uid(), 'admin'::app_role));

-- Create policy for admin delete access to profile photos
CREATE POLICY "Admins can delete profile photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'profile-photos' AND has_role(auth.uid(), 'admin'::app_role));