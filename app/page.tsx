'use client';

import { motion } from 'framer-motion';
import { Heart, Brain, MessageCircle, BookOpen, TrendingUp, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LandingPage() {
  const router = useRouter();

  const features = [
    {
      icon: MessageCircle,
      title: '24/7 AI Companion',
      description: 'Chat with our compassionate AI trained in CBT and ACT therapeutic approaches, available whenever you need support.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: BookOpen,
      title: 'AI-Powered Journal',
      description: 'Track your mood and emotions with intelligent sentiment analysis and get personalized therapeutic insights.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: TrendingUp,
      title: 'Mood Analytics',
      description: 'Visualize your emotional patterns over time with interactive charts and discover what affects your wellbeing.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Brain,
      title: 'Coping Tools',
      description: 'Access breathing exercises, calming audio, and evidence-based techniques when you need them most.',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: Shield,
      title: 'Crisis Detection',
      description: 'Automatic identification of crisis keywords with immediate access to professional mental health resources.',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Sparkles,
      title: 'Personalized Experience',
      description: 'Choose your AI companion persona and customize your wellness journey to match your preferences.',
      gradient: 'from-pink-500 to-rose-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Logo */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-24 h-24">
                <Image
                  src="/logo.png"
                  alt="MindEase Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                MindEase
              </span>
            </h1>

            <p className="text-2xl md:text-3xl text-gray-700 mb-4 font-medium">
              Your Personal Mental Wellness Companion
            </p>

            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              An AI-powered mental health support platform designed for college students.
              Get compassionate, evidence-based support 24/7, completely free.
            </p>

            {/* CTA Button */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/auth')}
                className="px-12 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 text-xl"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-6 h-6" />
              </motion.button>
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-purple-300 rounded-full opacity-20 blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-300 rounded-full opacity-20 blur-xl"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Everything You Need for Mental Wellness
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Evidence-based tools and compassionate AI support to help you thrive
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              How MindEase Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, private, and effective mental health support in three steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Create Your Account',
                description: 'Sign up in seconds with just a username and email. Your data is encrypted and completely private.'
              },
              {
                step: '02',
                title: 'Chat & Journal',
                description: 'Talk to your AI companion or write in your mood journal. Get instant, personalized insights and support.'
              },
              {
                step: '03',
                title: 'Track Your Progress',
                description: 'View your mood trends, emotional patterns, and celebrate your mental wellness journey over time.'
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                  {step.step}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-3xl p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Mental Health Matters
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              College students face unique mental health challenges. MindEase is here to help.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { stat: '1 in 3', label: 'College students experience anxiety' },
              { stat: '24/7', label: 'Access to mental health support' },
              { stat: '100%', label: 'Free and confidential service' }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-5xl md:text-6xl font-bold mb-2">{item.stat}</div>
                <div className="text-lg opacity-90">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl p-12 md:p-16 text-center shadow-2xl"
        >
          <Heart className="w-16 h-16 text-purple-600 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Ready to Start Your Wellness Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join MindEase today and take the first step toward better mental health.
            Completely free, forever.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/auth')}
            className="px-12 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 text-xl mx-auto"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-6 h-6" />
          </motion.button>

          <p className="mt-6 text-sm text-gray-500">
            No credit card required • Sign up in 30 seconds
          </p>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-6 h-6 text-pink-500 mr-2" />
            <span className="text-xl font-bold">MindEase</span>
          </div>
          <p className="text-gray-400 mb-4">
            Making mental health support accessible, one conversation at a time.
          </p>
          <p className="text-sm text-gray-500">
            This tool complements but does not replace professional mental health services.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            © 2025 MindEase. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
