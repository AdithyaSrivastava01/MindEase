'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, MessageCircle, BookOpen, Volume2, Wind,
  TrendingUp, Sparkles, Calendar, Award, Shield
} from 'lucide-react';
import BreathingExercise from '../components/BreathingExercise';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [moodData, setMoodData] = useState<any[]>([]);
  const [journalCount, setJournalCount] = useState(0);
  const [averageMood, setAverageMood] = useState('0.0');
  const [showBreathingModal, setShowBreathingModal] = useState(false);

  useEffect(() => {
    const loadJournalData = () => {
      const journalEntries = localStorage.getItem('journalEntries');
      if (journalEntries) {
        const parsed = JSON.parse(journalEntries);
        setJournalCount(parsed.length);

        // Calculate average mood
        if (parsed.length > 0) {
          const avg = parsed.reduce((sum: number, e: any) => sum + (e.aiScore || e.score || 5), 0) / parsed.length;
          setAverageMood(avg.toFixed(1));
        }

        // Get last 7 entries for chart
        const last7 = parsed.slice(0, 7);
        const chartData = last7.map((entry: any) => {
          const entryDate = new Date(entry.date);
          return {
            day: entryDate.toLocaleDateString('en-US', { weekday: 'short' }),
            mood: entry.aiScore || entry.score || 5,
            date: entryDate.toLocaleDateString()
          };
        }).reverse();
        setMoodData(chartData);
      }
    };

    loadJournalData();
    const pollInterval = setInterval(loadJournalData, 2000);
    return () => clearInterval(pollInterval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Mindful Campus
                </h1>
                <p className="text-xs text-gray-600">Your wellness dashboard</p>
              </div>
            </div>
            <nav className="flex space-x-4">
              <Link href="/">
                <button className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium">
                  Chat
                </button>
              </Link>
              <Link href="/dashboard">
                <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium shadow-md">
                  Dashboard
                </button>
              </Link>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back! 👋
          </h2>
          <p className="text-lg text-gray-600">
            How are you feeling today? Let's check in on your wellness journey.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-purple-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{journalCount}</p>
            <p className="text-sm text-gray-600 mt-1">Journal Entries</p>
            <Link href="/journal" className="text-xs text-purple-600 hover:text-purple-700 font-medium mt-2 inline-block">
              View all →
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <Award className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{averageMood}/10</p>
            <p className="text-sm text-gray-600 mt-1">Average Mood</p>
            <p className="text-xs text-blue-600 font-medium mt-2">
              {parseFloat(averageMood) >= 7 ? 'Doing great! 🎉' : parseFloat(averageMood) >= 4 ? 'Keep going! 💪' : 'We\'re here for you ❤️'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-green-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-400 to-teal-500 rounded-xl">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <Shield className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-gray-800">24/7</p>
            <p className="text-sm text-gray-600 mt-1">Support Available</p>
            <p className="text-xs text-green-600 font-medium mt-2">Always here for you</p>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Mood Chart - Takes 2 columns */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Your Mood Journey</h3>
                  <p className="text-sm text-gray-600">AI-analyzed from your journal entries</p>
                </div>
                <div className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
              </div>

              {moodData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={moodData}>
                    <defs>
                      <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                    <YAxis domain={[0, 10]} stroke="#9ca3af" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="mood"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorMood)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 mb-3">No mood data yet</p>
                    <Link href="/journal">
                      <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all">
                        Start Journaling
                      </button>
                    </Link>
                  </div>
                </div>
              )}

              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                <p className="text-sm text-purple-900">
                  <strong>💡 How it works:</strong> Our AI analyzes your journal entries and automatically tracks your mood patterns over time.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions - 1 column */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-8">Quick Actions</h3>
              <div className="flex flex-col gap-4">
                <Link href="/">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-6 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="w-5 h-5" />
                      <span>Support Chat</span>
                    </div>
                    <span>→</span>
                  </motion.button>
                </Link>

                <Link href="/journal">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-5 h-5" />
                      <span>Mood Journal</span>
                    </div>
                    <span>→</span>
                  </motion.button>
                </Link>

                <Link href="/audio">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <Volume2 className="w-5 h-5" />
                      <span>Calming Sounds</span>
                    </div>
                    <span>→</span>
                  </motion.button>
                </Link>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowBreathingModal(true)}
                  className="w-full p-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <Wind className="w-5 h-5" />
                    <span>Breathing Exercise</span>
                  </div>
                  <span>✨</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Wellness Tip */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg p-6 border border-amber-200"
            >
              <div className="flex items-start space-x-3">
                <Sparkles className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-amber-900 mb-2">Daily Wellness Tip</h4>
                  <p className="text-sm text-amber-800">
                    Remember to take breaks throughout your day. Even 5 minutes of mindful breathing can help reduce stress and improve focus.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Student Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
            <p className="text-sm text-gray-700 italic mb-3">
              "The breathing exercises helped me through finals week. I feel so much calmer now."
            </p>
            <p className="text-xs text-gray-500">— Sarah, CS Major</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <p className="text-sm text-gray-700 italic mb-3">
              "Journaling with AI insights made me realize patterns I never noticed before."
            </p>
            <p className="text-xs text-gray-500">— Mike, Pre-Med</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
            <p className="text-sm text-gray-700 italic mb-3">
              "Having 24/7 support means everything. No more suffering in silence."
            </p>
            <p className="text-xs text-gray-500">— Alex, Engineering</p>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center text-gray-600 text-sm py-6">
          <p className="mb-1">Built with care for student mental health</p>
          <p className="text-xs">This tool complements but doesn't replace professional help</p>
        </div>
      </div>

      {/* Breathing Exercise Modal */}
      <AnimatePresence>
        {showBreathingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowBreathingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Breathing Exercise</h3>
                <button
                  onClick={() => setShowBreathingModal(false)}
                  className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                <BreathingExercise />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
