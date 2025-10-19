# User ID Handling - Current Implementation

## Current State (localStorage):

Right now, **there is NO user ID** being saved with journal entries because:
- The app uses `localStorage` which is tied to the browser
- Each browser = one "user"
- No authentication system yet
- No multi-user support

### Current Journal Entry Structure:
```json
{
  "id": "1234567890",
  "date": "2025-10-18T...",
  "aiScore": 7,
  "content": "My journal entry...",
  "aiInsights": "AI feedback...",
  "emotions": ["hopeful", "anxious"]
}
```

**Missing:** `user_id` field

---

## When You Add Supabase:

Once you connect Supabase, each journal entry will include:

```json
{
  "id": "uuid-here",
  "user_id": "auth-user-uuid-here",  // ← Added automatically
  "date": "2025-10-18T...",
  "aiScore": 7,
  "content": "My journal entry...",
  "aiInsights": "AI feedback...",
  "emotions": ["hopeful", "anxious"]
}
```

---

## How User ID Will Work:

### 1. **User Signs Up/Logs In**
```typescript
// Supabase Auth handles this
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});

// User ID is: data.user.id
```

### 2. **Saving Journal Entry**
```typescript
// Get current logged-in user
const { data: { user } } = await supabase.auth.getUser();

// Save entry with user_id
const entry = {
  user_id: user.id,  // ← Automatically from auth
  content: "My journal...",
  ai_score: 7,
  // ...
};

await supabase.from('journal_entries').insert([entry]);
```

### 3. **Fetching User's Entries**
```typescript
// Supabase RLS (Row Level Security) automatically filters by user_id
const { data } = await supabase
  .from('journal_entries')
  .select('*')
  .order('created_at', { ascending: false });

// Only returns entries where user_id = current logged-in user
```

---

## Migration Plan:

When you're ready to add Supabase:

1. **User logs in** → Gets a user_id
2. **Migrate localStorage data** → Add user_id to old entries
3. **Save to Supabase** → All new entries automatically include user_id
4. **RLS ensures privacy** → Users can only see their own data

---

## For Now (Single User):

Since it's just you testing:
- **No user_id needed** - localStorage is already isolated per browser
- Journal entries work fine without it
- Chart shows your data correctly
- When you add Supabase, we'll migrate everything

---

## Summary:

**Current:** No user_id (not needed for localStorage single-user)
**Future:** user_id added automatically by Supabase Auth
**Action Needed:** None until you set up Supabase authentication

The app is ready for multi-user support - just needs Supabase credentials!
