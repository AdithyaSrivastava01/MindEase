import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  onboarding_complete: boolean;
  preferences: {
    persona: 'gentle' | 'direct' | 'humorous';
    notifications: boolean;
  };
}

export interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  ai_score: number;
  ai_insights: string;
  emotions: string[];
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  created_at: string;
  updated_at: string;
}

// Helper functions
export const journalHelpers = {
  // Get all journal entries for current user
  async getEntries(userId: string): Promise<JournalEntry[]> {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Create new journal entry
  async createEntry(entry: Omit<JournalEntry, 'id' | 'created_at'>): Promise<JournalEntry> {
    const { data, error } = await supabase
      .from('journal_entries')
      .insert([entry])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get mood data for chart (last 7 entries)
  async getMoodChartData(userId: string) {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('ai_score, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(7);

    if (error) throw error;

    return (data || []).reverse().map(entry => ({
      day: new Date(entry.created_at).toLocaleDateString('en-US', { weekday: 'short' }),
      mood: entry.ai_score,
      date: new Date(entry.created_at).toLocaleDateString()
    }));
  },

  // Get average mood score
  async getAverageMood(userId: string): Promise<number> {
    const entries = await this.getEntries(userId);
    if (entries.length === 0) return 0;
    const sum = entries.reduce((acc, entry) => acc + entry.ai_score, 0);
    return sum / entries.length;
  }
};

export const conversationHelpers = {
  // Get current conversation for user
  async getConversation(userId: string): Promise<Conversation | null> {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data;
  },

  // Save conversation
  async saveConversation(conversation: Omit<Conversation, 'id' | 'created_at' | 'updated_at'>): Promise<Conversation> {
    const { data, error } = await supabase
      .from('conversations')
      .upsert([conversation])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export const activityHelpers = {
  // Log coping activity
  async logActivity(userId: string, activityType: string) {
    const { error } = await supabase
      .from('coping_activities')
      .insert([{
        user_id: userId,
        activity_type: activityType
      }]);

    if (error) throw error;
  }
};

export const crisisHelpers = {
  // Create crisis flag
  async createFlag(userId: string, severity: string, message: string) {
    const { error } = await supabase
      .from('crisis_flags')
      .insert([{
        user_id: userId,
        severity,
        message,
        handled: false
      }]);

    if (error) throw error;
  }
};
