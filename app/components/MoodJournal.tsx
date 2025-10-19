'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, TrendingUp, Sparkles, Calendar } from 'lucide-react';

interface JournalEntry {
  id: string;
  date: Date;
  mood: number;
  content: string;
  insights?: string;
}

interface MoodJournalProps {
  onEntryAdded?: (entry: JournalEntry) => void;
}

export default function MoodJournal({ onEntryAdded }: MoodJournalProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState('');
  const [currentMood, setCurrentMood] = useState(5);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsight, setAiInsight] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    // Load entries from sessionStorage
    const stored = sessionStorage.getItem('journalEntries');
    if (stored) {
      const parsed = JSON.parse(stored);
      setEntries(parsed.map((e: any) => ({ ...e, date: new Date(e.date) })));
    }
  }, []);

  const moodEmojis = ['😢', '😔', '😐', '🙂', '😊', '😄', '🌟'];
  const moodLabels = ['Very Low', 'Low', 'Below Average', 'Neutral', 'Good', 'Great', 'Excellent'];

  const generateInsights = async (content: string, mood: number) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/journal-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, mood })
      });

      const data = await response.json();
      setAiInsight(data.insight || '');
    } catch (error) {
      console.error('Failed to generate insights:', error);
      setAiInsight('Thank you for sharing. Journaling is a powerful tool for self-reflection.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveEntry = () => {
    if (!currentEntry.trim()) return;

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date(),
      mood: currentMood,
      content: currentEntry,
      insights: aiInsight
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    sessionStorage.setItem('journalEntries', JSON.stringify(updatedEntries));

    if (onEntryAdded) onEntryAdded(newEntry);

    // Reset form
    setCurrentEntry('');
    setCurrentMood(5);
    setAiInsight('');
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
            {/* Mood Slider */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                How are you feeling? {moodEmojis[currentMood - 1]}
              </label>
              <input
                type="range"
                min="1"
                max="7"
                value={currentMood}
                onChange={(e) => setCurrentMood(parseInt(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">{moodLabels[0]}</span>
                <span className="text-xs text-gray-600 font-medium">{moodLabels[currentMood - 1]}</span>
                <span className="text-xs text-gray-500">{moodLabels[6]}</span>
              </div>
            </div>

            {/* Journal Entry */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                What's on your mind?
              </label>
              <textarea
                value={currentEntry}
                onChange={(e) => setCurrentEntry(e.target.value)}
                placeholder="Write freely about your thoughts, feelings, experiences... This is your private space."
                className="w-full h-40 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-800"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => generateInsights(currentEntry, currentMood)}
                disabled={!currentEntry.trim() || isAnalyzing}
                className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-5 h-5" />
                <span>{isAnalyzing ? 'Analyzing...' : 'Get AI Insights'}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={saveEntry}
                disabled={!currentEntry.trim()}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Entry
              </motion.button>
            </div>

            {/* AI Insights */}
            <AnimatePresence>
              {aiInsight && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-purple-200 rounded-xl p-4"
                >
                  <div className="flex items-start space-x-3">
                    <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-purple-900 mb-1">AI Insights</h4>
                      <p className="text-sm text-purple-800">{aiInsight}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{moodEmojis[entry.mood - 1]}</span>
                        <span className="text-sm text-gray-600">
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
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
