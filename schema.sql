-- Idempotent migration for testimonials + generated_content with RLS
-- Assumptions:
-- 1) gen_random_uuid() is available (pgcrypto extension). If not present, enable it.
-- 2) auth.users exists (Supabase built-in).
-- 3) This script will create missing columns/tables; it will NOT drop existing tables by default.

-- Ensure pgcrypto is available for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create testimonials table if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'testimonials'
  ) THEN
    CREATE TABLE public.testimonials (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
      user_id uuid REFERENCES auth.users NOT NULL,
      content text,
      file_url text,
      type text CHECK (type IN ('text','video')) NOT NULL
    );
  ELSE
    -- Table exists: ensure required columns exist; add them if missing.
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'testimonials' AND column_name = 'id'
    ) THEN
      ALTER TABLE public.testimonials ADD COLUMN id uuid DEFAULT gen_random_uuid();
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'testimonials' AND column_name = 'created_at'
    ) THEN
      ALTER TABLE public.testimonials ADD COLUMN created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'testimonials' AND column_name = 'user_id'
    ) THEN
      ALTER TABLE public.testimonials ADD COLUMN user_id uuid REFERENCES auth.users;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'testimonials' AND column_name = 'content'
    ) THEN
      ALTER TABLE public.testimonials ADD COLUMN content text;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'testimonials' AND column_name = 'file_url'
    ) THEN
      ALTER TABLE public.testimonials ADD COLUMN file_url text;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'testimonials' AND column_name = 'type'
    ) THEN
      ALTER TABLE public.testimonials ADD COLUMN type text;
      ALTER TABLE public.testimonials ADD CONSTRAINT testimonials_type_check CHECK (type IN ('text','video'));
    ELSE
      -- Ensure check constraint exists; add it if missing
      PERFORM 1 FROM pg_constraint c
      JOIN pg_class t ON c.conrelid = t.oid
      JOIN pg_namespace n ON t.relnamespace = n.oid
      WHERE c.contype = 'c'
        AND n.nspname = 'public'
        AND t.relname = 'testimonials'
        AND c.conname = 'testimonials_type_check';
      IF NOT FOUND THEN
        ALTER TABLE public.testimonials ADD CONSTRAINT testimonials_type_check CHECK (type IN ('text','video'));
      END IF;
    END IF;
  END IF;
END
$$;

-- Ensure id column is primary key
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON t.relnamespace = n.oid
    WHERE c.contype = 'p'
      AND n.nspname = 'public'
      AND t.relname = 'testimonials'
  ) THEN
    ALTER TABLE public.testimonials ADD PRIMARY KEY (id);
  END IF;
EXCEPTION WHEN others THEN
  -- ignore if cannot add primary key (e.g., due to duplicates)
  RAISE NOTICE 'Could not add primary key to testimonials; check for duplicate ids or existing PK.';
END
$$;

-- Create generated_content table if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'generated_content'
  ) THEN
    CREATE TABLE public.generated_content (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
      testimonial_id uuid REFERENCES public.testimonials(id) ON DELETE CASCADE NOT NULL,
      user_id uuid REFERENCES auth.users NOT NULL,
      linkedin_post text,
      twitter_thread text,
      email_newsletter text,
      landing_page_headline text,
      slide_deck_outline text,
      raw_json jsonb
    );
  ELSE
    -- Table exists: add missing columns
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'generated_content' AND column_name = 'id'
    ) THEN
      ALTER TABLE public.generated_content ADD COLUMN id uuid DEFAULT gen_random_uuid();
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'generated_content' AND column_name = 'created_at'
    ) THEN
      ALTER TABLE public.generated_content ADD COLUMN created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'generated_content' AND column_name = 'testimonial_id'
    ) THEN
      ALTER TABLE public.generated_content ADD COLUMN testimonial_id uuid REFERENCES public.testimonials(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'generated_content' AND column_name = 'user_id'
    ) THEN
      ALTER TABLE public.generated_content ADD COLUMN user_id uuid REFERENCES auth.users;
    END IF;

    -- add other columns if missing
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'generated_content' AND column_name = 'linkedin_post'
    ) THEN
      ALTER TABLE public.generated_content ADD COLUMN linkedin_post text;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'generated_content' AND column_name = 'twitter_thread'
    ) THEN
      ALTER TABLE public.generated_content ADD COLUMN twitter_thread text;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'generated_content' AND column_name = 'email_newsletter'
    ) THEN
      ALTER TABLE public.generated_content ADD COLUMN email_newsletter text;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'generated_content' AND column_name = 'landing_page_headline'
    ) THEN
      ALTER TABLE public.generated_content ADD COLUMN landing_page_headline text;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'generated_content' AND column_name = 'slide_deck_outline'
    ) THEN
      ALTER TABLE public.generated_content ADD COLUMN slide_deck_outline text;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'generated_content' AND column_name = 'raw_json'
    ) THEN
      ALTER TABLE public.generated_content ADD COLUMN raw_json jsonb;
    END IF;
  END IF;
END
$$;

-- Ensure primary key exists on generated_content
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON t.relnamespace = n.oid
    WHERE c.contype = 'p'
      AND n.nspname = 'public'
      AND t.relname = 'generated_content'
  ) THEN
    ALTER TABLE public.generated_content ADD PRIMARY KEY (id);
  END IF;
EXCEPTION WHEN others THEN
  RAISE NOTICE 'Could not add primary key to generated_content; check for duplicate ids or existing PK.';
END
$$;

-- Enable RLS (idempotent)
ALTER TABLE IF EXISTS public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.generated_content ENABLE ROW LEVEL SECURITY;

-- Drop conflicting policies if they exist, then create desired policies.
-- Testimonials policies
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'testimonials' AND policyname = 'Users can view their own testimonials'
  ) THEN
    DROP POLICY "Users can view their own testimonials" ON public.testimonials;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'testimonials' AND policyname = 'Users can insert their own testimonials'
  ) THEN
    DROP POLICY "Users can insert their own testimonials" ON public.testimonials;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'testimonials' AND policyname = 'Users can delete their own testimonials'
  ) THEN
    DROP POLICY "Users can delete their own testimonials" ON public.testimonials;
  END IF;
END
$$;

CREATE POLICY "Users can view their own testimonials"
  ON public.testimonials FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert their own testimonials"
  ON public.testimonials FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their own testimonials"
  ON public.testimonials FOR DELETE
  USING ((SELECT auth.uid()) = user_id);

-- Generated_content policies
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'generated_content' AND policyname = 'Users can view their own generated content'
  ) THEN
    DROP POLICY "Users can view their own generated content" ON public.generated_content;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'generated_content' AND policyname = 'Users can insert their own generated content'
  ) THEN
    DROP POLICY "Users can insert their own generated content" ON public.generated_content;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'generated_content' AND policyname = 'Users can delete their own generated content'
  ) THEN
    DROP POLICY "Users can delete their own generated content" ON public.generated_content;
  END IF;
END
$$;

CREATE POLICY "Users can view their own generated content"
  ON public.generated_content FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert their own generated content"
  ON public.generated_content FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their own generated content"
  ON public.generated_content FOR DELETE
  USING ((SELECT auth.uid()) = user_id);