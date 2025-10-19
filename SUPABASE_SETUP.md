# Supabase Setup Guide for Mindful Companion

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Save your project URL and anon key

## 2. Database Schema

Run this SQL in your Supabase SQL Editor:

```sql
-- 1. Create users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  onboarding_complete BOOLEAN DEFAULT FALSE,
  preferences JSONB DEFAULT '{
    "persona": "gentle",
    "notifications": true
  }'::jsonb
);

-- 2. Create journal_entries table (mood tracking)
CREATE TABLE journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  ai_score INTEGER CHECK (ai_score >= 1 AND ai_score <= 10),
  ai_insights TEXT,
  emotions TEXT[], -- Array of detected emotions
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Create conversations table
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  messages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Create coping_activities table
CREATE TABLE coping_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  activity_type TEXT, -- 'breathing', 'audio', 'chat', etc.
  completed_at TIMESTAMP DEFAULT NOW()
);

-- 5. Create crisis_flags table
CREATE TABLE crisis_flags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message TEXT,
  handled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 6. Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE coping_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE crisis_flags ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS Policies
-- Users can only read/update their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Journal entries
CREATE POLICY "Users can CRUD own journal entries" ON journal_entries
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Conversations
CREATE POLICY "Users can CRUD own conversations" ON conversations
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Coping activities
CREATE POLICY "Users can CRUD own activities" ON coping_activities
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Crisis flags (users can insert, admins can view all)
CREATE POLICY "Users can create crisis flags" ON crisis_flags
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own crisis flags" ON crisis_flags
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- 8. Create indexes for performance
CREATE INDEX idx_journal_user_created ON journal_entries(user_id, created_at DESC);
CREATE INDEX idx_conversations_user ON conversations(user_id, updated_at DESC);
CREATE INDEX idx_coping_user_created ON coping_activities(user_id, completed_at DESC);
CREATE INDEX idx_crisis_handled ON crisis_flags(handled, created_at DESC);

-- 9. Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 3. Firebase Storage for Audio Files

1. Go to Firebase Console → Storage
2. Create folder structure:
   ```
   storage/
   ├── audio/
   │   ├── nature/
   │   │   ├── gentle-rain.mp3
   │   │   ├── ocean-waves.mp3
   │   │   ├── forest-birds.mp3
   │   │   └── gentle-breeze.mp3
   │   └── asmr/
   │       ├── meditation-bells.mp3
   │       └── white-noise.mp3
   ```

3. Upload your audio files
4. Get download URLs for each file
5. Update `app/audio/page.tsx` with Firebase URLs

## 4. Environment Variables

Add these to your `.env.local` file:

```env
# Existing
OPENAI_API_KEY=your_openai_key

# Add Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Firebase (optional - for audio storage)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
```

## 5. Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

## 6. Benefits of Supabase

✅ **Multi-user support**: Each user has their own data
✅ **Real-time sync**: Changes sync across devices
✅ **Secure**: Row-level security ensures data privacy
✅ **Scalable**: PostgreSQL database handles millions of users
✅ **Authentication**: Built-in auth with email, Google, etc.
✅ **Mood tracking**: AI scores stored and queryable
✅ **Analytics**: Query patterns and insights across users

## 7. Data Migration from localStorage

Once Supabase is set up, we'll migrate existing localStorage data:
- Journal entries → `journal_entries` table
- Conversations → `conversations` table
- User preferences → `users` table

## 8. Next Steps

1. Set up Supabase project
2. Run SQL schema
3. Add environment variables
4. Install dependencies
5. I'll create the Supabase client utilities
6. Migrate localStorage to Supabase
7. Add authentication
