-- =============================================
-- MindEase Database Migration Script
-- =============================================
-- This script updates your existing database to work with the new auth system
-- Run this in your Supabase SQL Editor

-- =============================================
-- STEP 1: UPDATE USERS TABLE
-- =============================================

-- Add new columns to existing users table
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS username TEXT,
  ADD COLUMN IF NOT EXISTS display_name TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Change id to reference auth.users if it doesn't already
-- First, check if there's a foreign key constraint
DO $$
BEGIN
  -- Drop existing primary key if needed and recreate with proper reference
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'users_id_fkey'
    AND table_name = 'users'
  ) THEN
    -- Add foreign key constraint to auth.users
    ALTER TABLE public.users
      DROP CONSTRAINT IF EXISTS users_pkey,
      ADD CONSTRAINT users_pkey PRIMARY KEY (id),
      ADD CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Make username unique and required
ALTER TABLE public.users
  ALTER COLUMN username SET NOT NULL,
  ADD CONSTRAINT users_username_unique UNIQUE (username);

-- Make email unique if not already
ALTER TABLE public.users
  ADD CONSTRAINT users_email_unique UNIQUE (email);

-- Update name column to display_name for consistency (optional, comment out if you want to keep 'name')
-- UPDATE public.users SET display_name = name WHERE display_name IS NULL;

-- =============================================
-- STEP 2: CREATE TRIGGER TO SYNC AUTH.USERS -> PUBLIC.USERS
-- =============================================

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, username, email, display_name, created_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'display_name',
      NEW.raw_user_meta_data->>'username',
      split_part(NEW.email, '@', 1)
    ),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- STEP 3: UPDATE MOOD_ENTRIES TABLE
-- =============================================

-- Rename mood_entries to journal_entries if you want consistency with new schema
-- Or keep mood_entries and add additional columns

-- Option A: Keep mood_entries as is, just add new columns
ALTER TABLE public.mood_entries
  ADD COLUMN IF NOT EXISTS ai_score NUMERIC(3, 1),
  ADD COLUMN IF NOT EXISTS ai_insights JSONB,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Rename journal_entry to content for consistency (optional)
-- ALTER TABLE public.mood_entries RENAME COLUMN journal_entry TO content;

-- Option B: Create new journal_entries table and migrate data (RECOMMENDED)
-- Uncomment below if you want a clean schema matching the new design

/*
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 10),
  mood_label TEXT,
  emotions JSONB, -- Changed from TEXT[] to JSONB for flexibility
  ai_score NUMERIC(3, 1),
  ai_insights JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migrate data from mood_entries to journal_entries
INSERT INTO public.journal_entries (id, user_id, content, mood_score, mood_label, emotions, created_at)
SELECT
  id,
  user_id,
  journal_entry,
  mood_score,
  mood_label,
  to_jsonb(emotions), -- Convert TEXT[] to JSONB
  created_at
FROM public.mood_entries;

-- Enable RLS on journal_entries
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for journal_entries
CREATE POLICY "Users can view own entries"
  ON public.journal_entries
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own entries"
  ON public.journal_entries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own entries"
  ON public.journal_entries
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own entries"
  ON public.journal_entries
  FOR DELETE
  USING (auth.uid() = user_id);

-- Optional: Drop old mood_entries table after verifying migration
-- DROP TABLE public.mood_entries;
*/

-- =============================================
-- STEP 4: UPDATE RLS POLICIES
-- =============================================

-- Drop old RLS policies
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can read own mood entries" ON public.mood_entries;
DROP POLICY IF EXISTS "Users can read own conversations" ON public.conversations;

-- Create new RLS policies for users table
CREATE POLICY "Users can view own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Allow authenticated users to read usernames (for login lookup)
CREATE POLICY "Allow username lookup"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (true);

-- Update mood_entries RLS policies
CREATE POLICY "Users can view own mood entries"
  ON public.mood_entries
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood entries"
  ON public.mood_entries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mood entries"
  ON public.mood_entries
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own mood entries"
  ON public.mood_entries
  FOR DELETE
  USING (auth.uid() = user_id);

-- Update conversations RLS policies
CREATE POLICY "Users can view own conversations"
  ON public.conversations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON public.conversations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON public.conversations
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
  ON public.conversations
  FOR DELETE
  USING (auth.uid() = user_id);

-- Update coping_strategies RLS policies
CREATE POLICY "Users can view own coping strategies"
  ON public.coping_strategies
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own coping strategies"
  ON public.coping_strategies
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Update crisis_flags RLS policies (keep read-only for users)
CREATE POLICY "Users can view own crisis flags"
  ON public.crisis_flags
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own crisis flags"
  ON public.crisis_flags
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- STEP 5: CREATE INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_id ON public.mood_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_entries_created_at ON public.mood_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_coping_strategies_user_id ON public.coping_strategies(user_id);
CREATE INDEX IF NOT EXISTS idx_crisis_flags_user_id ON public.crisis_flags(user_id);

-- =============================================
-- STEP 6: GRANT PERMISSIONS
-- =============================================

GRANT SELECT ON public.users TO authenticated;
GRANT ALL ON public.mood_entries TO authenticated;
GRANT ALL ON public.conversations TO authenticated;
GRANT ALL ON public.coping_strategies TO authenticated;
GRANT ALL ON public.crisis_flags TO authenticated;

-- =============================================
-- STEP 7: MIGRATE EXISTING USERS (IF ANY)
-- =============================================

-- If you have existing users without auth.users entries, you'll need to handle them manually
-- This section helps identify users that need migration

-- Check for users not in auth.users
-- SELECT * FROM public.users WHERE id NOT IN (SELECT id FROM auth.users);

-- For each existing user, you'll need to either:
-- 1. Delete them if they're test data
-- 2. Have them re-register through the signup form
-- 3. Manually create auth.users entries (not recommended)

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Run these after migration to verify everything works:

-- Check users table structure
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'users' AND table_schema = 'public';

-- Check if trigger exists
-- SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- Check RLS policies
-- SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';

-- =============================================
-- CLEANUP (OPTIONAL)
-- =============================================

-- Remove onboarding_complete column if not used in new design
-- ALTER TABLE public.users DROP COLUMN IF EXISTS onboarding_complete;

-- Remove name column if you migrated to display_name
-- ALTER TABLE public.users DROP COLUMN IF EXISTS name;
