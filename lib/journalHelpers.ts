import { supabase } from './supabase';

export interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  mood: number;
  mood_label?: string;
  emotions?: string[];
  ai_score?: number;
  ai_insights?: any;
  created_at: string;
  updated_at?: string;
}

export const journalHelpers = {
  // Create a new journal entry
  async createEntry(data: {
    user_id: string;
    content: string;
    mood: number;
    mood_label?: string;
    emotions?: string[];
    ai_insights?: string;
  }) {
    const { data: entry, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: data.user_id,
        content: data.content,
        mood: data.mood,
        mood_label: data.mood_label,
        emotions: data.emotions || null,  // Store as JSONB array directly
        ai_insights: data.ai_insights ? { insight: data.ai_insights } : null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating journal entry:', error);
      throw error;
    }

    return entry;
  },

  // Get all entries for a user
  async getEntries(userId: string) {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching journal entries:', error);
      throw error;
    }

    return data || [];
  },

  // Get recent entries (for dashboard chart)
  async getRecentEntries(userId: string, limit: number = 7) {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent entries:', error);
      throw error;
    }

    return data || [];
  },

  // Delete a journal entry
  async deleteEntry(entryId: string, userId: string) {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', entryId)
      .eq('user_id', userId); // Safety: ensure user owns the entry

    if (error) {
      console.error('Error deleting journal entry:', error);
      throw error;
    }

    return true;
  },

  // Get entry count for a user
  async getEntryCount(userId: string) {
    const { count, error } = await supabase
      .from('journal_entries')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) {
      console.error('Error getting entry count:', error);
      return 0;
    }

    return count || 0;
  },

  // Calculate average mood for a user
  async getAverageMood(userId: string) {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('mood')
      .eq('user_id', userId);

    if (error || !data || data.length === 0) {
      return 0;
    }

    const sum = data.reduce((acc, entry) => acc + (entry.mood || 0), 0);
    return sum / data.length;
  },
};
