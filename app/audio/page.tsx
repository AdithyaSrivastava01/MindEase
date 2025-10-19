'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Play, Pause, ArrowLeft, Cloud, Waves, Wind as WindIcon, Music } from 'lucide-react';
import Link from 'next/link';

interface AudioTrack {
  id: string;
  name: string;
  description: string;
  category: string;
  emoji: string;
  icon: any;
  color: string;
  url: string;
  duration: string;
}

const audioLibrary: AudioTrack[] = [
  {
    id: 'rain-gentle',
    name: 'Gentle Rain',
    description: 'Soft rainfall to ease your mind and reduce stress',
    category: 'Nature',
    emoji: '🌧️',
    icon: Cloud,
    color: 'from-blue-400 to-cyan-500',
    url: 'https://assets.mixkit.co/active_storage/sfx/2390/2390-preview.mp3',
    duration: '10:00'
  },
  {
    id: 'ocean-waves',
    name: 'Ocean Waves',
    description: 'Calming ocean sounds for deep relaxation',
    category: 'Nature',
    emoji: '🌊',
    icon: Waves,
    color: 'from-teal-400 to-blue-500',
    url: 'https://assets.mixkit.co/active_storage/sfx/2393/2393-preview.mp3',
    duration: '15:00'
  },
  {
    id: 'forest-birds',
    name: 'Forest Ambience',
    description: 'Peaceful birds chirping in a serene forest',
    category: 'Nature',
    emoji: '🌲',
    icon: Music,
    color: 'from-green-400 to-emerald-500',
    url: 'https://assets.mixkit.co/active_storage/sfx/2394/2394-preview.mp3',
    duration: '20:00'
  },
  {
    id: 'wind-chimes',
    name: 'Gentle Breeze',
    description: 'Soft wind sounds through trees',
    category: 'Nature',
    emoji: '🍃',
    icon: WindIcon,
    color: 'from-cyan-400 to-teal-500',
    url: 'https://assets.mixkit.co/active_storage/sfx/2395/2395-preview.mp3',
    duration: '12:00'
  },
  {
    id: 'meditation-bells',
    name: 'Meditation Bells',
    description: 'Calming bell sounds for mindfulness practice',
    category: 'ASMR',
    emoji: '🔔',
    icon: Music,
    color: 'from-purple-400 to-pink-500',
    url: 'https://assets.mixkit.co/active_storage/sfx/2396/2396-preview.mp3',
    duration: '8:00'
  },
  {
    id: 'white-noise',
    name: 'White Noise',
    description: 'Soothing white noise for focus and calm',
    category: 'ASMR',
    emoji: '⚪',
    icon: Volume2,
    color: 'from-gray-400 to-slate-500',
    url: 'https://assets.mixkit.co/active_storage/sfx/2397/2397-preview.mp3',
    duration: '30:00'
  }
];

export default function AudioLibraryPage() {
  const [selectedTrack, setSelectedTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const audioRef = useRef<HTMLAudioElement>(null);

  const categories = ['All', 'Nature', 'ASMR'];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const selectTrack = (track: AudioTrack) => {
    if (selectedTrack?.id === track.id) {
      // Same track clicked - just toggle play/pause
      togglePlay();
    } else {
      // New track selected
      setSelectedTrack(track);
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.load();
        // Auto-play new track after a brief moment
        setTimeout(() => {
          audioRef.current?.play();
          setIsPlaying(true);
        }, 100);
      }
    }
  };

  const filteredTracks = selectedCategory === 'All'
    ? audioLibrary
    : audioLibrary.filter(track => track.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
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
              <Volume2 className="w-8 h-8 text-blue-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Calming Audio Library</h1>
                <p className="text-sm text-gray-600">ASMR & Nature Sounds for Relaxation</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Category Filter */}
        <div className="flex space-x-3 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-xl font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Now Playing */}
        {selectedTrack && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-r ${selectedTrack.color} rounded-2xl shadow-xl p-8 mb-6 text-white`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={togglePlay}
                  className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white/30 transition-colors"
                >
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                </motion.button>
                <div>
                  <h3 className="text-2xl font-bold mb-1">{selectedTrack.name}</h3>
                  <p className="text-sm opacity-90">{selectedTrack.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs opacity-75">{selectedTrack.category}</span>
                    <span className="text-xs opacity-75">•</span>
                    <span className="text-xs opacity-75">{selectedTrack.duration}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Volume2 className="w-5 h-5" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-32 h-2 bg-white/30 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Audio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTracks.map((track, index) => {
            const Icon = track.icon;
            return (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => selectTrack(track)}
                className={`cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden ${
                  selectedTrack?.id === track.id ? 'ring-4 ring-purple-400' : ''
                }`}
              >
                <div className={`bg-gradient-to-r ${track.color} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="w-8 h-8" />
                    <span className="text-4xl">{track.emoji}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{track.name}</h3>
                  <p className="text-sm opacity-90">{track.duration}</p>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-3">{track.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                      {track.category}
                    </span>
                    {selectedTrack?.id === track.id && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="flex items-center space-x-1 text-purple-600"
                      >
                        <span className="text-xs font-medium">
                          {isPlaying ? 'Playing' : 'Paused'}
                        </span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Info */}
        <div className="mt-8 bg-purple-50 border border-purple-200 rounded-2xl p-6">
          <h3 className="font-semibold text-purple-900 mb-2">💡 How to Use</h3>
          <ul className="text-sm text-purple-800 space-y-2 list-disc list-inside">
            <li>Click on any audio track to start playing</li>
            <li>Use the volume slider to adjust sound level</li>
            <li>All tracks loop automatically for continuous relaxation</li>
            <li>Listen while journaling, chatting, or during breathing exercises</li>
            <li>Best experienced with headphones for immersive relaxation</li>
          </ul>
        </div>
      </div>

      {/* Hidden Audio Element */}
      {selectedTrack && (
        <audio
          ref={audioRef}
          src={selectedTrack.url}
          loop
          onEnded={() => setIsPlaying(false)}
        />
      )}
    </div>
  );
}
