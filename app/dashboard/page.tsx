'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, TrendingUp, Heart, Shield, 
  MessageCircle, Brain, Calendar, Award,
  BarChart3, Activity
} from 'lucide-react';
import MoodTracker from '../components/MoodTracker';
import BreathingExercise from '../components/BreathingExercise';
import Link from 'next/link';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 1247,
    dailyCheckIns: 89,
    avgMoodImprovement: 23,
    crisisInterventions: 12,
    copingExercises: 342
  });

  const [moodData, setMoodData] = useState<any[]>([]);
  const [showBreathing, setShowBreathing] = useState(false);

  useEffect(() => {
    // Load mood history for chart
    const history = localStorage.getItem('moodHistory');
    if (history) {
      const parsed = JSON.parse(history);
      const chartData = parsed.slice(-7).map((entry: any, index: number) => ({
        day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index % 7],
        mood: entry.score,
        date: new Date(entry.timestamp).toLocaleDateString()
      }));
      setMoodData(chartData);
    }

    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 3),
        dailyCheckIns: prev.dailyCheckIns + Math.floor(Math.random() * 2)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ icon: Icon, label, value, change, color }: any) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <span className={`text-sm font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      <p className="text-gray-600 text-sm mt-1">{label}</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Heart className="w-8 h-8 text-pink-500" />
            <h1 className="text-2xl font-bold text-gray-800">Mindful Campus Dashboard</h1>
          </div>
          <nav className="flex space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-800 font-medium">
              Chat
            </Link>
            <Link href="/dashboard" className="text-blue-600 font-medium">
              Dashboard
            </Link>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Impact Banner - MOVED TO TOP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white mb-8 shadow-xl"
        >
          <h2 className="text-3xl font-bold mb-3">Making a Real Impact 🌟</h2>
          <p className="text-lg opacity-90 mb-6">
            Together, we're creating a supportive community for student mental health
          </p>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-4xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <div className="text-sm opacity-75">Students Supported</div>
            </div>
            <div>
              <div className="text-4xl font-bold">{stats.avgMoodImprovement}%</div>
              <div className="text-sm opacity-75">Avg Mood Improvement</div>
            </div>
            <div>
              <div className="text-4xl font-bold">24/7</div>
              <div className="text-sm opacity-75">Always Available</div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard
            icon={Users}
            label="Active Today"
            value={stats.dailyCheckIns}
            change={12}
            color="bg-blue-500"
          />
          <StatCard
            icon={MessageCircle}
            label="Conversations"
            value="3.2K"
            change={8}
            color="bg-purple-500"
          />
          <StatCard
            icon={Shield}
            label="Crisis Handled"
            value={stats.crisisInterventions}
            color="bg-red-500"
          />
          <StatCard
            icon={Brain}
            label="Exercises Done"
            value={stats.copingExercises}
            change={15}
            color="bg-green-500"
          />
          <StatCard
            icon={Award}
            label="Satisfaction"
            value="4.8/5"
            color="bg-yellow-500"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Mood Trends Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Campus Mood Trends</h3>
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-500" />
                <span className="text-sm text-green-600 font-medium">Improving</span>
              </div>
            </div>
            
            {moodData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={moodData}>
                  <defs>
                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#888" />
                  <YAxis domain={[0, 10]} stroke="#888" />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e0e0e0' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="mood"
                    stroke="#8884d8"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorMood)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <p>Start tracking moods to see trends</p>
              </div>
            )}
            
            {/* Insights */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Insight:</strong> Student mood tends to dip mid-week. 
                Consider scheduling more support activities on Wednesdays.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
            <Link href = '/components/BreathingExercise'>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowBreathing(!showBreathing)}
                className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium shadow hover:shadow-lg transition-all"
              >
                🧘 Try Breathing Exercise
              </motion.button>
              </Link>
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full p-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-medium shadow hover:shadow-lg transition-all"
                >
                  💬 Start Support Chat
                </motion.button>
              </Link>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 bg-white border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
              >
                📊 Download Report
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 bg-white border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
              >
                🏥 Find Counselor
              </motion.button>
            </div>
          </div>
        </div>

        {/* Interactive Components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Mood Tracker */}
          <div>
            <MoodTracker onMoodLogged={(entry) => {
              // Update chart when mood is logged
              setMoodData(prev => [...prev, {
                day: new Date().toLocaleDateString('en', { weekday: 'short' }),
                mood: entry.score,
                date: new Date().toLocaleDateString()
              }].slice(-7));
            }} />
          </div>

          {/* Breathing Exercise or Success Stories */}
          <div>
            {showBreathing ? (
              <BreathingExercise />
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Student Stories</h3>
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-green-50 rounded-lg border border-green-200"
                  >
                    <p className="text-gray-700 italic">
                      "This app helped me realize I wasn't alone. The breathing exercises 
                      got me through my panic attacks during finals."
                    </p>
                    <p className="text-sm text-gray-500 mt-2">- Anonymous, CS Major</p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="p-4 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <p className="text-gray-700 italic">
                      "The daily check-ins made me more aware of my mental health patterns. 
                      I finally scheduled that counseling appointment."
                    </p>
                    <p className="text-sm text-gray-500 mt-2">- Anonymous, Pre-Med</p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 bg-purple-50 rounded-lg border border-purple-200"
                  >
                    <p className="text-gray-700 italic">
                      "Having 24/7 support means everything. No more suffering in silence 
                      at 3 AM."
                    </p>
                    <p className="text-sm text-gray-500 mt-2">- Anonymous, Engineering</p>
                  </motion.div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Crisis Prevention Alert */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-start space-x-4">
            <Shield className="w-6 h-6 text-yellow-600 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Proactive Crisis Prevention Active
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Our AI monitors for concerning patterns and provides immediate intervention 
                when needed. All students showing signs of distress receive priority support.
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white rounded-lg p-3">
                  <div className="text-2xl font-bold text-yellow-600">12</div>
                  <div className="text-xs text-gray-600">Interventions Today</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">100%</div>
                  <div className="text-xs text-gray-600">Response Rate</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-600">&lt;30s</div>
                  <div className="text-xs text-gray-600">Avg Response Time</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center text-gray-600 text-sm">
          <p>Built with 💙 for student mental health</p>
          <p className="mt-2">Remember: This tool complements but doesn't replace professional help</p>
        </div>
      </div>
    </div>
  );
}