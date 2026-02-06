-- Create enums
CREATE TYPE public.content_kind AS ENUM ('event', 'workshop', 'bootcamp');
CREATE TYPE public.content_status AS ENUM ('draft', 'published');
CREATE TYPE public.message_status AS ENUM ('unread', 'read');

-- Create is_admin helper function (SECURITY DEFINER to avoid recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(auth.email() = 'admin@ieee.cs', false)
$$;

-- Create site_settings table (singleton)
CREATE TABLE public.site_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  site_name text NOT NULL DEFAULT 'IEEE CS TEK-UP SBC',
  footer_text text DEFAULT '© 2024 IEEE Computer Society TEK-UP Student Branch Chapter. All rights reserved.',
  contact_email text DEFAULT 'contact@ieee-cs-tekup.org',
  facebook_url text,
  instagram_url text,
  linkedin_url text,
  address_text text DEFAULT 'TEK-UP University, Tunis, Tunisia',
  home_intro_md text DEFAULT 'Welcome to IEEE Computer Society TEK-UP Student Branch Chapter. We are dedicated to advancing technology for humanity.',
  maps_embed_url text,
  header_cta_text text DEFAULT 'Join IEEE',
  header_cta_url text DEFAULT 'https://www.ieee.org/membership/join/index.html',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create content_items table
CREATE TABLE public.content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind public.content_kind NOT NULL,
  title text NOT NULL,
  slug text NOT NULL,
  excerpt text,
  start_at timestamptz,
  end_at timestamptz,
  location text,
  format text DEFAULT 'In-person',
  cover_image_url text,
  registration_url text,
  description_md text,
  status public.content_status NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(kind, slug)
);

-- Create board_members table
CREATE TABLE public.board_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  position text NOT NULL,
  bio text,
  photo_url text,
  linkedin_url text,
  order_index integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create sponsors table
CREATE TABLE public.sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  website_url text,
  order_index integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create contact_messages table
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status public.message_status NOT NULL DEFAULT 'unread',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create newsletter_subscribers table
CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_items_updated_at
  BEFORE UPDATE ON public.content_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_board_members_updated_at
  BEFORE UPDATE ON public.board_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sponsors_updated_at
  BEFORE UPDATE ON public.sponsors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS on all tables
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for site_settings
CREATE POLICY "Anyone can view site settings" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admin can update site settings" ON public.site_settings
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admin can insert site settings" ON public.site_settings
  FOR INSERT WITH CHECK (public.is_admin());

-- RLS Policies for content_items
CREATE POLICY "Anyone can view published content" ON public.content_items
  FOR SELECT USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admin can insert content" ON public.content_items
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update content" ON public.content_items
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admin can delete content" ON public.content_items
  FOR DELETE USING (public.is_admin());

-- RLS Policies for board_members
CREATE POLICY "Anyone can view active board members" ON public.board_members
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Admin can insert board members" ON public.board_members
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update board members" ON public.board_members
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admin can delete board members" ON public.board_members
  FOR DELETE USING (public.is_admin());

-- RLS Policies for sponsors
CREATE POLICY "Anyone can view active sponsors" ON public.sponsors
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Admin can insert sponsors" ON public.sponsors
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update sponsors" ON public.sponsors
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admin can delete sponsors" ON public.sponsors
  FOR DELETE USING (public.is_admin());

-- RLS Policies for contact_messages
CREATE POLICY "Anyone can submit contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view contact messages" ON public.contact_messages
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admin can update contact messages" ON public.contact_messages
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admin can delete contact messages" ON public.contact_messages
  FOR DELETE USING (public.is_admin());

-- RLS Policies for newsletter_subscribers
CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view subscribers" ON public.newsletter_subscribers
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admin can delete subscribers" ON public.newsletter_subscribers
  FOR DELETE USING (public.is_admin());

-- Create storage bucket for public assets
INSERT INTO storage.buckets (id, name, public) VALUES ('public-assets', 'public-assets', true);

-- Storage policies for public-assets bucket
CREATE POLICY "Anyone can view public assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'public-assets');

CREATE POLICY "Admin can upload assets" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'public-assets' AND public.is_admin());

CREATE POLICY "Admin can update assets" ON storage.objects
  FOR UPDATE USING (bucket_id = 'public-assets' AND public.is_admin());

CREATE POLICY "Admin can delete assets" ON storage.objects
  FOR DELETE USING (bucket_id = 'public-assets' AND public.is_admin());

-- Insert default site settings
INSERT INTO public.site_settings (id) VALUES (1);