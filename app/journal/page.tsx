'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, TrendingUp, Sparkles, ArrowLeft, Calendar, Trash2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/useAuth';
import { journalHelpers } from '@/lib/journalHelpers';

interface JournalEntry {
  id: string;
  date: Date;
  aiScore: number; // AI-generated score 1-10
  content: string;
  aiInsights: string;
  emotions: string[];
}

export default function JournalPage() {
  const { user, loading: authLoading } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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
        id: e.id,
        date: new Date(e.created_at),
        aiScore: e.ai_score || e.mood || 5,
        content: e.content,
        aiInsights: e.ai_insights?.insight || '',
        emotions: Array.isArray(e.emotions) ? e.emotions : (e.emotions ? [] : [])
      })));
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeAndSave = async () => {
    if (!currentEntry.trim() || !user) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/journal-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: currentEntry })
      });

      const data = await response.json();

      // Save to database
      await journalHelpers.createEntry({
        user_id: user.id,
        content: currentEntry,
        mood: data.score || 5,
        ai_insights: data.insights || '',
        emotions: data.emotions || []
      });

      // Reload entries
      await loadEntries();

      // Reset form
      setCurrentEntry('');
      setShowNewEntry(false);
    } catch (error) {
      console.error('Failed to analyze entry:', error);
      alert('Failed to save journal entry. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 7) return 'text-green-600 bg-green-100';
    if (score >= 4) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 7 && score <= 10) return '😊'; // Good mood range (7-10)
    if (score >= 4 && score <= 6) return '😐'; // Neutral mood range (4-6)
    if (score >= 1 && score <= 3) return '😢'; // Low mood range (1-3)
    return '😐';
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

  const averageScore = entries.length > 0
    ? (entries.reduce((sum, e) => sum + e.aiScore, 0) / entries.length).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            </Link>
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-purple-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Mood Journal</h1>
                <p className="text-sm text-gray-600">AI-powered insights & tracking</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowNewEntry(!showNewEntry)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
          >
            {showNewEntry ? 'Cancel' : '+ New Entry'}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Entries</p>
                <p className="text-3xl font-bold text-purple-600">{entries.length}</p>
              </div>
              <Calendar className="w-12 h-12 text-purple-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Mood</p>
                <p className="text-3xl font-bold text-blue-600">{averageScore}/10</p>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">This Week</p>
                <p className="text-3xl font-bold text-green-600">
                  {entries.filter(e => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(e.date) > weekAgo;
                  }).length}
                </p>
              </div>
              <Sparkles className="w-12 h-12 text-green-400" />
            </div>
          </motion.div>
        </div>

        {/* New Entry Form */}
        {showNewEntry && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 mb-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Write Your Journal Entry</h3>
            <textarea
              value={currentEntry}
              onChange={(e) => setCurrentEntry(e.target.value)}
              placeholder="Express yourself freely... Write about your day, feelings, thoughts, or anything on your mind. The AI will analyze your entry and provide insights."
              className="w-full h-48 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-800"
            />
            <div className="flex justify-end mt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={analyzeAndSave}
                disabled={!currentEntry.trim() || isAnalyzing}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>{isAnalyzing ? 'Analyzing...' : 'Save & Analyze'}</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Journal Entries */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800">Your Journal History</h3>

          {entries.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-lg mb-2">No journal entries yet</p>
              <p className="text-gray-400">Start journaling to track your emotional journey!</p>
            </div>
          ) : (
            entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow relative"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${getScoreColor(entry.aiScore)}`}>
                      {getScoreEmoji(entry.aiScore)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(entry.aiScore)}`}>
                          {entry.aiScore}/10
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      {entry.emotions && entry.emotions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {entry.emotions.map((emotion, i) => (
                            <span key={i} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                              {emotion}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Delete Button */}
                  {deleteConfirmId !== entry.id && (
                    <button
                      onClick={() => handleDeleteClick(entry.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Delete Confirmation */}
                <AnimatePresence>
                  {deleteConfirmId === entry.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute inset-0 bg-red-50 border-2 border-red-300 rounded-2xl p-6 flex flex-col items-center justify-center space-y-4 z-10"
                    >
                      <div className="flex items-center space-x-2 text-red-700">
                        <AlertTriangle className="w-6 h-6" />
                        <p className="font-semibold text-lg">Delete this entry?</p>
                      </div>
                      <p className="text-sm text-red-600 text-center">This action cannot be undone</p>
                      <div className="flex space-x-3">
                        <button
                          onClick={cancelDelete}
                          className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => confirmDelete(entry.id)}
                          className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="prose max-w-none mb-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
                </div>

                {entry.aiInsights && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4">
                    <div className="flex items-start space-x-2">
                      <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-purple-900 mb-1">AI Insights</h4>
                        <p className="text-sm text-purple-800">{entry.aiInsights}</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
