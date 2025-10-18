'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Minus, 
  Sun, Cloud, CloudRain, Zap, Heart,
  Smile, Frown, Meh
} from 'lucide-react';

interface MoodEntry {
  score: number;
  label: string;
  emotions: string[];
  timestamp: Date;
  note?: string;
}

const MOOD_LABELS = [
  { score: 1, label: "Very Low", icon: CloudRain, color: "text-gray-600" },
  { score: 2, label: "Low", icon: CloudRain, color: "text-gray-500" },
  { score: 3, label: "Difficult", icon: Cloud, color: "text-blue-600" },
  { score: 4, label: "Challenging", icon: Cloud, color: "text-blue-500" },
  { score: 5, label: "Neutral", icon: Minus, color: "text-yellow-500" },
  { score: 6, label: "Okay", icon: Minus, color: "text-yellow-400" },
  { score: 7, label: "Good", icon: Sun, color: "text-orange-400" },
  { score: 8, label: "Great", icon: Sun, color: "text-orange-500" },
  { score: 9, label: "Excellent", icon: Zap, color: "text-green-500" },
  { score: 10, label: "Amazing", icon: Zap, color: "text-green-600" }
];

const EMOTIONS = [
  { name: "Anxious", emoji: "😰" },
  { name: "Stressed", emoji: "😣" },
  { name: "Calm", emoji: "😌" },
  { name: "Happy", emoji: "😊" },
  { name: "Sad", emoji: "😢" },
  { name: "Excited", emoji: "🎉" },
  { name: "Tired", emoji: "😴" },
  { name: "Hopeful", emoji: "🌟" },
  { name: "Frustrated", emoji: "😤" },
  { name: "Grateful", emoji: "🙏" },
  { name: "Lonely", emoji: "💔" },
  { name: "Confident", emoji: "💪" }
];

export default function MoodTracker({ onMoodLogged }: { onMoodLogged?: (entry: MoodEntry) => void }) {
  const [currentMood, setCurrentMood] = useState(5);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [showEmotions, setShowEmotions] = useState(false);
  const [recentMoods, setRecentMoods] = useState<MoodEntry[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Load recent moods from localStorage
    const stored = localStorage.getItem('moodHistory');
    if (stored) {
      setRecentMoods(JSON.parse(stored));
    }
  }, []);

  const getMoodData = () => MOOD_LABELS[currentMood - 1];
  const currentMoodData = getMoodData();
  const Icon = currentMoodData.icon;

  const calculateTrend = () => {
    if (recentMoods.length < 2) return 'neutral';
    const recent = recentMoods.slice(-7);
    const average = recent.reduce((sum, m) => sum + m.score, 0) / recent.length;
    const lastMood = recent[recent.length - 1].score;
    
    if (lastMood > average + 0.5) return 'up';
    if (lastMood < average - 0.5) return 'down';
    return 'neutral';
  };

  const handleEmotionToggle = (emotion: string) => {
    setSelectedEmotions(prev => 
      prev.includes(emotion) 
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion].slice(0, 3) // Max 3 emotions
    );
  };

  const logMood = () => {
    const entry: MoodEntry = {
      score: currentMood,
      label: currentMoodData.label,
      emotions: selectedEmotions,
      timestamp: new Date(),
      note: note.trim() || undefined
    };

    const updatedMoods = [...recentMoods, entry].slice(-30); // Keep last 30 entries
    setRecentMoods(updatedMoods);
    localStorage.setItem('moodHistory', JSON.stringify(updatedMoods));
    localStorage.setItem('recentMood', currentMood.toString());
    
    // Show success animation
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    
    // Reset form
    setSelectedEmotions([]);
    setNote('');
    setShowEmotions(false);
    
    // Callback
    if (onMoodLogged) {
      onMoodLogged(entry);
    }
  };

  const trend = calculateTrend();

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">How are you feeling?</h2>
        {trend !== 'neutral' && (
          <div className="flex items-center space-x-1">
            {trend === 'up' ? (
              <>
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-sm text-green-600 font-medium">Improving</span>
              </>
            ) : (
              <>
                <TrendingDown className="w-5 h-5 text-red-500" />
                <span className="text-sm text-red-600 font-medium">Let's talk</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Mood Visualization */}
      <div className="text-center mb-8">
        <motion.div
          key={currentMood}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="inline-block"
        >
          <Icon className={`w-24 h-24 ${currentMoodData.color} mx-auto mb-3`} />
        </motion.div>
        <h3 className="text-3xl font-bold text-gray-800">{currentMood}/10</h3>
        <p className={`text-lg font-medium ${currentMoodData.color} mt-1`}>
          {currentMoodData.label}
        </p>
      </div>

      {/* Mood Slider */}
      <div className="mb-8">
        <input
          type="range"
          min="1"
          max="10"
          value={currentMood}
          onChange={(e) => setCurrentMood(parseInt(e.target.value))}
          className="w-full h-3 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-gray-400 via-yellow-400 to-green-400"
          style={{
            background: `linear-gradient(to right, 
              #9CA3AF 0%, 
              #FCD34D ${(currentMood - 1) * 11}%, 
              #10B981 100%)`
          }}
        />
        <div className="flex justify-between mt-2">
          <Frown className="w-5 h-5 text-gray-400" />
          <Meh className="w-5 h-5 text-yellow-400" />
          <Smile className="w-5 h-5 text-green-400" />
        </div>
      </div>

      {/* Emotions Selection */}
      <div className="mb-6">
        <button
          onClick={() => setShowEmotions(!showEmotions)}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 mb-3"
        >
          {showEmotions ? 'Hide' : 'Add'} emotions (optional)
        </button>
        
        <AnimatePresence>
          {showEmotions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="grid grid-cols-3 gap-2"
            >
              {EMOTIONS.map((emotion) => (
                <motion.button
                  key={emotion.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEmotionToggle(emotion.name)}
                  className={`p-2 rounded-lg border-2 transition-all ${
                    selectedEmotions.includes(emotion.name)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl">{emotion.emoji}</span>
                  <span className="text-xs block mt-1">{emotion.name}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Note */}
      <div className="mb-6">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Any thoughts to add? (optional)"
          className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={2}
        />
      </div>

      {/* Log Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={logMood}
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
      >
        Log My Mood
      </motion.button>

      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center"
          >
            <p className="text-green-700 font-medium flex items-center justify-center">
              <Heart className="w-4 h-4 mr-2" />
              Mood logged! You're doing great by checking in with yourself.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Moods Mini Chart */}
      {recentMoods.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-600 mb-3">Your last 7 check-ins:</p>
          <div className="flex justify-between items-end h-16">
            {recentMoods.slice(-7).map((mood, index) => (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${mood.score * 10}%` }}
                className="flex-1 mx-1"
              >
                <div
                  className={`w-full rounded-t transition-all ${
                    mood.score <= 3 ? 'bg-gray-400' :
                    mood.score <= 6 ? 'bg-yellow-400' :
                    'bg-green-400'
                  }`}
                  style={{ height: '100%' }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}