'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface CalmingAudioProps {
  onClose?: () => void;
}

const audioTracks = [
  {
    id: 'rain',
    name: 'Gentle Rain',
    description: 'Soft rainfall to ease your mind',
    emoji: '🌧️',
    url: 'https://assets.mixkit.co/active_storage/sfx/2390/2390-preview.mp3',
    color: 'from-blue-400 to-cyan-500'
  },
  {
    id: 'ocean',
    name: 'Ocean Waves',
    description: 'Calming ocean sounds',
    emoji: '🌊',
    url: 'https://assets.mixkit.co/active_storage/sfx/2393/2393-preview.mp3',
    color: 'from-teal-400 to-blue-500'
  },
  {
    id: 'forest',
    name: 'Forest Birds',
    description: 'Peaceful forest ambience',
    emoji: '🌲',
    url: 'https://assets.mixkit.co/active_storage/sfx/2394/2394-preview.mp3',
    color: 'from-green-400 to-emerald-500'
  },
  {
    id: 'wind',
    name: 'Gentle Wind',
    description: 'Soft breeze through trees',
    emoji: '🍃',
    url: 'https://assets.mixkit.co/active_storage/sfx/2395/2395-preview.mp3',
    color: 'from-cyan-400 to-teal-500'
  }
];

export default function CalmingAudio({ onClose }: CalmingAudioProps) {
  const [selectedTrack, setSelectedTrack] = useState(audioTracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

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

  const selectTrack = (track: typeof audioTracks[0]) => {
    setSelectedTrack(track);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${selectedTrack.color} p-6 text-white`}>
        <div className="text-center">
          <div className="text-6xl mb-3">{selectedTrack.emoji}</div>
          <h2 className="text-2xl font-bold">{selectedTrack.name}</h2>
          <p className="text-sm opacity-90 mt-1">{selectedTrack.description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Player Controls */}
        <div className="flex flex-col items-center space-y-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePlay}
            className={`w-20 h-20 rounded-full bg-gradient-to-r ${selectedTrack.color} text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow`}
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </motion.button>

          {/* Volume Control */}
          <div className="flex items-center space-x-3 w-full max-w-xs">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const newVolume = parseFloat(e.target.value);
                setVolume(newVolume);
                if (newVolume > 0 && isMuted) setIsMuted(false);
              }}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #60a5fa ${(isMuted ? 0 : volume) * 100}%, #e5e7eb ${(isMuted ? 0 : volume) * 100}%)`
              }}
            />
          </div>
        </div>

        {/* Track Selection */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Choose Your Sound</h3>
          <div className="grid grid-cols-2 gap-3">
            {audioTracks.map((track) => (
              <motion.button
                key={track.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => selectTrack(track)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedTrack.id === track.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-1">{track.emoji}</div>
                <div className="text-sm font-medium text-gray-800">{track.name}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <p className="text-sm text-purple-800">
            <strong>Tip:</strong> Find a comfortable position, close your eyes, and let the sounds wash over you.
            Focus on your breath and allow yourself to relax.
          </p>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={selectedTrack.url}
        loop
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
}
