'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Heart, AlertCircle, Loader2, Wind, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MoodTracker from './MoodTracker';
import BreathingExercise from './BreathingExercise';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: {
    breathingExercise: boolean;
    moodTracking: boolean;
  };
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi there 💙 I'm here to listen and support you. How are you feeling today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCrisisResources, setShowCrisisResources] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Simulate typing delay for empathy
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          userContext: {
            name: localStorage.getItem('userName') || '',
            recentMood: localStorage.getItem('recentMood') || ''
          }
        })
      });

      const data = await response.json();
      
      if (data.crisisDetected && data.crisisLevel === 'critical') {
        setShowCrisisResources(true);
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.content,
        timestamp: new Date(),
        suggestions: data.suggestions
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment. If you're in crisis, please call 988 for immediate support.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="w-6 h-6 text-pink-500" />
            <h1 className="text-xl font-semibold text-gray-800">Mindful Companion</h1>
          </div>
          <div className="text-sm text-gray-500">
            Your safe space to talk
          </div>
        </div>
      </div>

      {/* Crisis Resources Banner */}
      <AnimatePresence>
        {showCrisisResources && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-red-50 border-b border-red-200"
          >
            <div className="max-w-4xl mx-auto p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-800 font-medium">Crisis Support Available 24/7</p>
                <div className="mt-2 space-y-1 text-sm text-red-700">
                  <p>• <strong>988 Lifeline:</strong> Call or text 988</p>
                  <p>• <strong>Crisis Text Line:</strong> Text HOME to 741741</p>
                  <p>• <strong>Emergency:</strong> Call 911</p>
                </div>
              </div>
              <button
                onClick={() => setShowCrisisResources(false)}
                className="text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white shadow-md text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </motion.div>

              {/* Suggestion Cards */}
              {message.role === 'assistant' && message.suggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex justify-start mt-2 ml-2"
                >
                  <div className="max-w-[70%] space-y-2">
                    {message.suggestions.breathingExercise && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowBreathingExercise(true)}
                        className="w-full flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
                      >
                        <Wind className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-semibold text-sm">Try Breathing Exercise</div>
                          <div className="text-xs opacity-90">Take a moment to calm down</div>
                        </div>
                      </motion.button>
                    )}

                    {message.suggestions.moodTracking && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowMoodTracker(true)}
                        className="w-full flex items-center space-x-3 bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
                      >
                        <TrendingUp className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-semibold text-sm">Track Your Mood</div>
                          <div className="text-xs opacity-90">Log how you're feeling</div>
                        </div>
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white shadow-md rounded-2xl px-4 py-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Share what's on your mind..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
              disabled={isLoading}
              suppressHydrationWarning
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Your conversations are private and secure. I'm here to support, not judge.
          </p>
        </div>
      </div>

      {/* Mood Tracker Modal */}
      <AnimatePresence>
        {showMoodTracker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowMoodTracker(false)}
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
              <div className="sticky top-0 bg-gradient-to-r from-green-500 to-teal-500 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Track Your Mood</h3>
                <button
                  onClick={() => setShowMoodTracker(false)}
                  className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                <MoodTracker onMoodLogged={(entry) => {
                  setShowMoodTracker(false);
                  setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: `Thanks for logging your mood! I can see you're feeling ${entry.score}/10. ${
                      entry.score < 5
                        ? "I'm here to support you. Would you like to talk about what's bothering you?"
                        : "That's great to hear! What's contributing to your positive mood?"
                    }`,
                    timestamp: new Date()
                  }]);
                }} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breathing Exercise Modal */}
      <AnimatePresence>
        {showBreathingExercise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowBreathingExercise(false)}
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
              <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Breathing Exercise</h3>
                <button
                  onClick={() => setShowBreathingExercise(false)}
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