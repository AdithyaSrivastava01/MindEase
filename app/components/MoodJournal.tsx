'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles, Calendar, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';
import { journalHelpers } from '@/lib/journalHelpers';

interface JournalEntry {
  id: string;
  user_id: string;
  date: Date;
  mood: number;
  content: string;
  insights?: string;
  created_at?: string;
}

interface MoodJournalProps {
  onEntryAdded?: (entry: { mood: number; insights?: string }) => void;
  onEntryDeleted?: () => void;
}

export default function MoodJournal({ onEntryAdded, onEntryDeleted }: MoodJournalProps) {
  const { user, loading: authLoading } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      loadEntries();
    }
  }, [user, authLoading]);

  const loadEntries = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await journalHelpers.getEntries(user.id);
      setEntries(data.map((e: any) => ({
        ...e,
        date: new Date(e.created_at),
        insights: e.ai_insights?.insight
      })));
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMoodEmoji = (mood: number) => {
    if (mood >= 1 && mood <= 3) return '😢'; // Low mood range
    if (mood >= 4 && mood <= 6) return '😐'; // Neutral mood range
    if (mood >= 7 && mood <= 10) return '😊'; // Good mood range
    return '😐';
  };

  const analyzeAndSave = async () => {
    if (!currentEntry.trim() || !user) return;

    setIsAnalyzing(true);
    try {
      // Call the journal-analysis API to get AI score, emotions, and insights
      const response = await fetch('/api/journal-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: currentEntry })
      });

      const data = await response.json();

      // Save to database with AI-generated mood score and insights
      await journalHelpers.createEntry({
        user_id: user.id,
        content: currentEntry,
        mood: data.score || 5,
        ai_insights: data.insights || '',
        emotions: data.emotions || []
      });

      // Reload entries from database
      await loadEntries();

      // Call callback with AI-generated mood and insights
      if (onEntryAdded) {
        onEntryAdded({
          mood: data.score || 5,
          insights: data.insights
        });
      }

      // Reset form
      setCurrentEntry('');
    } catch (error) {
      console.error('Failed to analyze and save entry:', error);
      alert('Failed to save journal entry. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeleteClick = (entryId: string) => {
    setDeleteConfirmId(entryId);
  };

  const confirmDelete = async (entryId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      await journalHelpers.deleteEntry(entryId, user.id);

      // Reload entries from database
      await loadEntries();

      if (onEntryDeleted) onEntryDeleted();

      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Failed to delete journal entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Mood Journal</h2>
              <p className="text-sm opacity-90">Express yourself freely</p>
            </div>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
          >
            <Calendar className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {!showHistory ? (
          <>
            {/* Journal Entry */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                What's on your mind?
              </label>
              <p className="text-xs text-gray-600 mb-3">
                Write freely about your thoughts and feelings. AI will automatically analyze your mood and provide insights.
              </p>
              <textarea
                value={currentEntry}
                onChange={(e) => setCurrentEntry(e.target.value)}
                placeholder="Express yourself freely... Write about your day, feelings, thoughts, or anything on your mind. The AI will analyze your entry and provide insights."
                className="w-full h-48 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-800"
              />
            </div>

            {/* Mood Score Legend */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-3">
              <p className="text-xs font-semibold text-purple-900 mb-2">AI Mood Scoring:</p>
              <div className="flex justify-around text-xs text-gray-700">
                <span>😢 1-3 Low</span>
                <span>😐 4-6 Neutral</span>
                <span>😊 7-10 Good</span>
              </div>
            </div>

            {/* Action Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={analyzeAndSave}
              disabled={!currentEntry.trim() || isAnalyzing || !user}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>{isAnalyzing ? 'Analyzing & Saving...' : 'Save & Analyze with AI'}</span>
            </motion.button>
          </>
        ) : (
          /* Journal History */
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Your Journal Entries</h3>
              <button
                onClick={() => setShowHistory(false)}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                ← Back to Journal
              </button>
            </div>

            {entries.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No entries yet. Start journaling to track your journey!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {entries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 relative"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                        <span className="text-sm font-medium text-gray-700">{entry.mood}/10</span>
                        <span className="text-sm text-gray-600">
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      {/* Delete Button */}
                      {deleteConfirmId !== entry.id && (
                        <button
                          onClick={() => handleDeleteClick(entry.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Delete Confirmation */}
                    <AnimatePresence>
                      {deleteConfirmId === entry.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute inset-0 bg-red-50 border-2 border-red-300 rounded-xl p-4 flex flex-col items-center justify-center space-y-3"
                        >
                          <div className="flex items-center space-x-2 text-red-700">
                            <AlertTriangle className="w-5 h-5" />
                            <p className="font-semibold text-sm">Delete this entry?</p>
                          </div>
                          <p className="text-xs text-red-600 text-center">This action cannot be undone</p>
                          <div className="flex space-x-2">
                            <button
                              onClick={cancelDelete}
                              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => confirmDelete(entry.id)}
                              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <p className="text-sm text-gray-700 mb-2">{entry.content}</p>
                    {entry.insights && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mt-2">
                        <p className="text-xs text-purple-800"><strong>Insight:</strong> {entry.insights}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
