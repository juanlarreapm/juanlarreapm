-- 1. Fix profiles table - users can only see their own profile, admins can see all
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- 2. Fix contact_submissions - admin only access
DROP POLICY IF EXISTS "Authenticated users can view contact submissions" ON public.contact_submissions;
CREATE POLICY "Admins can view contact submissions" ON public.contact_submissions FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- 3. Fix blog_categories - admin only management
DROP POLICY IF EXISTS "Authenticated users can manage categories" ON public.blog_categories;
CREATE POLICY "Admins can manage categories" ON public.blog_categories FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. Fix blog_post_categories - admin/author only
DROP POLICY IF EXISTS "Authenticated users can manage post categories" ON public.blog_post_categories;
CREATE POLICY "Admins can manage post categories" ON public.blog_post_categories FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));