<div align="center">
  <img src="./public/logo.png" alt="MindEase Logo" width="200"/>

  # MindEase

  ### Your Personal Mental Wellness Companion

  *An AI-powered mental health support platform for college students*

  **[🚀 Live Demo](https://mindease-lilac.vercel.app/)**

  [![Live Demo](https://img.shields.io/badge/demo-live-brightgreen?style=for-the-badge)](https://mindease-lilac.vercel.app/)
  [![Deployed on Vercel](https://img.shields.io/badge/deployed-vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991?style=for-the-badge&logo=openai)](https://openai.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

---

## Project Objective

MindEase is a compassionate, evidence-based mental health companion designed specifically for college students. The platform leverages artificial intelligence and therapeutic approaches (CBT and ACT) to provide:

- **24/7 Mental Health Support**: Conversational AI companion trained in Cognitive Behavioral Therapy (CBT) and Acceptance and Commitment Therapy (ACT)
- **Mood Journaling**: AI-powered journal with sentiment analysis and personalized insights
- **Crisis Detection**: Automatic identification of crisis keywords with resource recommendations
- **Coping Tools**: Integrated breathing exercises, ASMR/calming audio, and therapeutic interventions
- **Pattern Recognition**: Track emotional patterns and mood trends over time

The goal is to make mental health support accessible, stigma-free, and available whenever students need it, while complementing (not replacing) professional mental health services.

---

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization for mood tracking

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Supabase** - PostgreSQL database with real-time capabilities
- **OpenAI GPT-4** - AI-powered chat and journal analysis

### Authentication & Database
- **Supabase Auth** - User authentication and session management
- **Supabase PostgreSQL** - Relational database for:
  - User profiles and preferences
  - Journal entries
  - Conversation history
  - Crisis flags
  - Coping activity logs

### External Services
- **OpenAI API** - Natural language processing and therapeutic responses
- **Supabase Cloud** - Hosted database and authentication

---

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    MindEase Application                      │
│                     (Next.js Full-Stack)                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Frontend (React/Next.js)                  │  │
│  │                                                         │  │
│  │  ├─ Pages                                              │  │
│  │  │  ├─ Landing Page (/)                               │  │
│  │  │  ├─ Dashboard (/dashboard)                         │  │
│  │  │  ├─ Chat Interface (/chat)                         │  │
│  │  │  ├─ Mood Journal (/journal)                        │  │
│  │  │  └─ Auth Pages (/auth/*)                           │  │
│  │  │                                                      │  │
│  │  ├─ Components                                         │  │
│  │  │  ├─ Chat.tsx - AI conversation interface           │  │
│  │  │  ├─ MoodJournal.tsx - Journaling component         │  │
│  │  │  ├─ MoodChart.tsx - Mood visualization             │  │
│  │  │  └─ Crisis resources & coping tools                │  │
│  │  │                                                      │  │
│  │  └─ Client Libraries                                   │  │
│  │     ├─ lib/supabase.ts - Supabase client              │  │
│  │     └─ lib/journalHelpers.ts - Data helpers           │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↕                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │          Backend (Next.js API Routes)                  │  │
│  │                                                         │  │
│  │  ├─ /api/chat - AI conversation endpoint              │  │
│  │  │  ├─ Context-aware responses                        │  │
│  │  │  ├─ Crisis keyword detection                       │  │
│  │  │  └─ Feature suggestions (breathing, journal, ASMR) │  │
│  │  │                                                      │  │
│  │  ├─ /api/journal-analysis - AI mood analysis          │  │
│  │  │  ├─ Sentiment scoring (1-10)                       │  │
│  │  │  ├─ Emotion extraction                             │  │
│  │  │  └─ CBT/ACT-based insights                         │  │
│  │  │                                                      │  │
│  │  └─ /api/journal-insights - Entry feedback            │  │
│  │     └─ Supportive therapeutic insights                │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
└───────────────────────────────────────────────────────────────┘
                    ↓                        ↓
        ┌───────────────────┐    ┌──────────────────┐
        │   Supabase Cloud  │    │   OpenAI API     │
        │                   │    │                  │
        │  ├─ PostgreSQL    │    │  ├─ GPT-4 Turbo  │
        │  │  ├─ users      │    │  └─ Chat         │
        │  │  ├─ journal_   │    │     Completions  │
        │  │  │  entries    │    │                  │
        │  │  ├─ conversa-  │    └──────────────────┘
        │  │  │  tions      │
        │  │  ├─ crisis_    │
        │  │  │  flags      │
        │  │  └─ coping_    │
        │  │     activities │
        │  │                │
        │  └─ Auth          │
        │     ├─ User mgmt  │
        │     └─ Sessions   │
        └───────────────────┘
```

### Database Schema

```
┌─────────────────────┐
│       users         │
├─────────────────────┤
│ id (PK)             │
│ email               │
│ name                │
│ created_at          │
│ onboarding_complete │
│ preferences (JSON)  │
│  ├─ persona         │
│  └─ notifications   │
└─────────────────────┘
          │
          │ 1:N
          ↓
┌─────────────────────┐       ┌─────────────────────┐
│  journal_entries    │       │   conversations     │
├─────────────────────┤       ├─────────────────────┤
│ id (PK)             │       │ id (PK)             │
│ user_id (FK)        │       │ user_id (FK)        │
│ content             │       │ messages (JSONB[])  │
│ mood                │       │  ├─ role            │
│ mood_label          │       │  ├─ content         │
│ emotions (JSONB[])  │       │  └─ timestamp       │
│ ai_score            │       │ created_at          │
│ ai_insights (JSONB) │       │ updated_at          │
│ created_at          │       └─────────────────────┘
│ updated_at          │
└─────────────────────┘       ┌─────────────────────┐
          │                   │   crisis_flags      │
          │ 1:N               ├─────────────────────┤
          ↓                   │ id (PK)             │
┌─────────────────────┐       │ user_id (FK)        │
│  coping_activities  │       │ severity            │
├─────────────────────┤       │ message             │
│ id (PK)             │       │ handled             │
│ user_id (FK)        │       │ created_at          │
│ activity_type       │       └─────────────────────┘
│ created_at          │
└─────────────────────┘
```

---

## Data Flow Diagrams

### 1. Chat Conversation Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │ Types message
     ↓
┌──────────────────┐
│  Chat Component  │
│  (Chat.tsx)      │
└────┬─────────────┘
     │ POST /api/chat
     │ { messages[], userContext }
     ↓
┌────────────────────────────────────────┐
│      API Route: /api/chat/route.ts     │
│                                        │
│  1. Receives conversation history      │
│  2. Detects crisis keywords            │
│  3. Detects breathing/journal/ASMR     │
│     needs                              │
│  4. Builds contextual prompt with      │
│     user persona                       │
└────┬───────────────────────────────────┘
     │ OpenAI API call
     ↓
┌──────────────────────┐
│   OpenAI GPT-4       │
│                      │
│  - System prompt:    │
│    CBT/ACT therapist │
│  - Full conversation │
│    context           │
│  - Temperature: 0.7  │
└────┬─────────────────┘
     │ AI response
     ↓
┌─────────────────────────────────────────┐
│     Response Processing                 │
│                                         │
│  Returns JSON:                          │
│  {                                      │
│    content: "...",                      │
│    crisisDetected: boolean,             │
│    crisisLevel: "critical" | "none",    │
│    suggestions: {                       │
│      breathingExercise: boolean,        │
│      moodJournal: boolean,              │
│      calmingAudio: boolean              │
│    }                                    │
│  }                                      │
└────┬────────────────────────────────────┘
     │
     ↓
┌──────────────────────┐
│  Chat Component      │
│                      │
│  - Displays AI msg   │
│  - Shows crisis      │
│    resources         │
│  - Suggests coping   │
│    tools             │
└──────────────────────┘
```

### 2. Mood Journal Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │ Writes journal entry
     ↓
┌────────────────────────┐
│  MoodJournal Component │
│  (MoodJournal.tsx)     │
└────┬───────────────────┘
     │ POST /api/journal-analysis
     │ { content }
     ↓
┌─────────────────────────────────────────────┐
│  API Route: /api/journal-analysis/route.ts  │
│                                             │
│  Sends to OpenAI:                           │
│  - Analyze emotional tone                   │
│  - Assign mood score (1-10)                 │
│  - Extract 2-4 emotions                     │
│  - Provide CBT/ACT insights                 │
└────┬────────────────────────────────────────┘
     │ OpenAI API call (JSON mode)
     ↓
┌──────────────────────┐
│   OpenAI GPT-4       │
│                      │
│  Returns:            │
│  {                   │
│    score: 1-10,      │
│    emotions: [],     │
│    insights: "..."   │
│  }                   │
└────┬─────────────────┘
     │
     ↓
┌────────────────────────┐
│  MoodJournal Component │
│                        │
│  Displays:             │
│  - AI mood score       │
│  - Detected emotions   │
│  - Therapeutic insights│
└────┬───────────────────┘
     │ User confirms save
     ↓
┌──────────────────────────────────────┐
│  lib/journalHelpers.ts               │
│                                      │
│  journalHelpers.createEntry({        │
│    user_id,                          │
│    content,                          │
│    mood: aiScore,                    │
│    emotions: aiEmotions,             │
│    ai_insights                       │
│  })                                  │
└────┬─────────────────────────────────┘
     │ Supabase insert
     ↓
┌──────────────────────┐
│  Supabase Database   │
│                      │
│  journal_entries     │
│  table updated       │
└──────────────────────┘
```

### 3. User Authentication Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │ Sign up / Login
     ↓
┌───────────────────┐
│  Auth Component   │
│  (/auth/*)        │
└────┬──────────────┘
     │ Supabase Auth
     ↓
┌─────────────────────────────┐
│  lib/supabase.ts            │
│                             │
│  supabase.auth.signUp()     │
│  supabase.auth.signInWith() │
└────┬────────────────────────┘
     │
     ↓
┌──────────────────────────┐
│   Supabase Auth          │
│                          │
│  - Validates credentials │
│  - Creates session       │
│  - Returns user object   │
└────┬─────────────────────┘
     │ Session token
     ↓
┌────────────────────────────┐
│  Client-side Session       │
│                            │
│  - Stored in localStorage  │
│  - Auto-refresh tokens     │
│  - Row Level Security (RLS)│
│    enforces data isolation │
└────────────────────────────┘
     │
     ↓
┌──────────────────────────────┐
│  All Supabase queries        │
│  automatically include       │
│  user context via session    │
│  token                       │
└──────────────────────────────┘
```

### 4. Dashboard Data Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │ Visits /dashboard
     ↓
┌────────────────────────┐
│  Dashboard Page        │
│  (dashboard/page.tsx)  │
└────┬───────────────────┘
     │ Parallel data fetches
     ├────────────────────────────┐
     ↓                            ↓
┌──────────────────┐    ┌─────────────────────┐
│ journalHelpers.  │    │ journalHelpers.     │
│ getRecentEntries │    │ getAverageMood      │
│ (userId)         │    │ (userId)            │
└────┬─────────────┘    └────┬────────────────┘
     │                       │
     ↓                       ↓
┌────────────────────────────────────┐
│      Supabase Database             │
│                                    │
│  SELECT * FROM journal_entries     │
│  WHERE user_id = $1                │
│  ORDER BY created_at DESC          │
│  LIMIT 7                           │
└────┬───────────────────────────────┘
     │ Returns entries
     ↓
┌────────────────────────┐
│  MoodChart Component   │
│                        │
│  - Transforms data     │
│  - Renders Recharts    │
│    line chart          │
│  - Shows 7-day trend   │
└────────────────────────┘
```

---

## Key Features

### Therapeutic AI Chat
- Context-aware conversations using GPT-4
- CBT and ACT-based therapeutic approaches
- Crisis keyword detection with resource recommendations
- Personalized AI persona (gentle, direct, humorous)
- Intelligent feature suggestions based on user needs

### AI-Powered Mood Journal
- Automatic sentiment analysis (1-10 scale)
- Emotion extraction and categorization
- Therapeutic insights using evidence-based practices
- Historical mood tracking and visualization
- Pattern recognition over time

### Mental Health Safety
- Automatic crisis detection
- National crisis hotline integration
- Activity logging for coping mechanisms
- Privacy-first design with secure data storage

### User Experience
- Clean, accessible interface
- Real-time AI responses
- Mood visualization with interactive charts
- Breathing exercises and calming audio integration
- Onboarding flow with preference customization

---

## Privacy & Security

- **End-to-end encryption** via Supabase
- **Row Level Security (RLS)** ensures users only access their own data
- **No data sharing** with third parties (except OpenAI API for processing)
- **HIPAA-aware design** (not HIPAA certified)
- **Session-based authentication** with automatic token refresh
- All sensitive operations require authentication

---

## Future Enhancements

- Mood prediction using machine learning
- Peer support community (moderated)
- Therapist connection portal
- Mobile app (React Native)
- Advanced analytics dashboard
- Integration with wearables for biometric data
- Multi-language support

---

<div align="center">

  **MindEase** - Making mental health support accessible, one conversation at a time.

  *This tool complements but does not replace professional mental health services.*

</div>
