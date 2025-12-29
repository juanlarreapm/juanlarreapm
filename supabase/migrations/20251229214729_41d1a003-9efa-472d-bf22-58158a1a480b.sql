-- Add foreign key from blog_posts.author_id to profiles.id
ALTER TABLE public.blog_posts
ADD CONSTRAINT blog_posts_author_id_fkey
FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE CASCADE;