'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Wind, Heart } from 'lucide-react';

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest' | 'idle';

export default function BreathingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathingPhase>('idle');
  const [counter, setCounter] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [totalCycles] = useState(4);
  
  // 4-7-8 breathing pattern
  const PHASES = {
    inhale: { duration: 4, next: 'hold', instruction: 'Breathe in slowly' },
    hold: { duration: 7, next: 'exhale', instruction: 'Hold your breath' },
    exhale: { duration: 8, next: 'rest', instruction: 'Exhale completely' },
    rest: { duration: 2, next: 'inhale', instruction: 'Rest' }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && phase !== 'idle') {
      const currentPhase = PHASES[phase as keyof typeof PHASES];
      
      if (counter > 0) {
        interval = setInterval(() => {
          setCounter(prev => prev - 1);
        }, 1000);
      } else {
        // Move to next phase
        if (phase === 'rest') {
          if (cycles < totalCycles - 1) {
            setCycles(prev => prev + 1);
            setPhase('inhale');
            setCounter(PHASES.inhale.duration);
          } else {
            // Exercise complete
            handleComplete();
          }
        } else {
          const nextPhase = currentPhase.next as BreathingPhase;
          setPhase(nextPhase);
          setCounter(PHASES[nextPhase as keyof typeof PHASES].duration);
        }
      }
    }
    
    return () => clearInterval(interval);
  }, [isActive, counter, phase, cycles]);

  const startExercise = () => {
    setIsActive(true);
    setPhase('inhale');
    setCounter(PHASES.inhale.duration);
    setCycles(0);
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const resetExercise = () => {
    setIsActive(false);
    setPhase('idle');
    setCounter(0);
    setCycles(0);
  };

  const handleComplete = () => {
    setIsActive(false);
    setPhase('idle');
    setCounter(0);
    
    // Log completion
    const completions = parseInt(sessionStorage.getItem('breathingCompletions') || '0');
    sessionStorage.setItem('breathingCompletions', (completions + 1).toString());
    
    // Show completion message
    setCycles(totalCycles);
  };

  const getCircleScale = () => {
    switch (phase) {
      case 'inhale': return 1.5;
      case 'hold': return 1.5;
      case 'exhale': return 1;
      case 'rest': return 1;
      default: return 1;
    }
  };

  const getBackgroundGradient = () => {
    switch (phase) {
      case 'inhale': return 'from-blue-400 to-cyan-400';
      case 'hold': return 'from-purple-400 to-pink-400';
      case 'exhale': return 'from-green-400 to-teal-400';
      case 'rest': return 'from-gray-300 to-gray-400';
      default: return 'from-blue-300 to-purple-300';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
      <div className="text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-2">
            <Wind className="w-6 h-6 text-blue-500 mr-2" />
            <h2 className="text-2xl font-bold text-gray-800">4-7-8 Breathing</h2>
          </div>
          <p className="text-gray-600 text-sm">
            A calming technique to reduce anxiety and improve focus
          </p>
        </div>

        {/* Breathing Circle */}
        <div className="relative h-64 flex items-center justify-center mb-8">
          <motion.div
            className={`absolute w-48 h-48 rounded-full bg-gradient-to-br ${getBackgroundGradient()} opacity-20`}
            animate={{
              scale: getCircleScale(),
            }}
            transition={{
              duration: phase === 'inhale' ? 4 : phase === 'exhale' ? 8 : 0,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className={`absolute w-40 h-40 rounded-full bg-gradient-to-br ${getBackgroundGradient()} opacity-30`}
            animate={{
              scale: getCircleScale() * 0.9,
            }}
            transition={{
              duration: phase === 'inhale' ? 4 : phase === 'exhale' ? 8 : 0,
              ease: "easeInOut",
              delay: 0.1
            }}
          />
          
          <motion.div
            className={`relative w-32 h-32 rounded-full bg-gradient-to-br ${getBackgroundGradient()} flex items-center justify-center text-white shadow-lg`}
            animate={{
              scale: getCircleScale() * 0.8,
            }}
            transition={{
              duration: phase === 'inhale' ? 4 : phase === 'exhale' ? 8 : 0,
              ease: "easeInOut",
              delay: 0.2
            }}
          >
            {phase !== 'idle' ? (
              <div>
                <div className="text-4xl font-bold">{counter}</div>
                <div className="text-xs uppercase tracking-wider mt-1">
                  {PHASES[phase as keyof typeof PHASES]?.instruction}
                </div>
              </div>
            ) : cycles === totalCycles ? (
              <div>
                <Heart className="w-12 h-12 mx-auto mb-2" />
                <div className="text-sm font-medium">Complete!</div>
              </div>
            ) : (
              <div className="text-sm font-medium">Ready to begin</div>
            )}
          </motion.div>
        </div>

        {/* Progress */}
        {phase !== 'idle' && cycles < totalCycles && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Cycle {cycles + 1} of {totalCycles}</span>
              <span>{phase}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                animate={{ width: `${((cycles + 1) / totalCycles) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        {/* Completion Message */}
        <AnimatePresence>
          {cycles === totalCycles && phase === 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
            >
              <p className="text-green-700 font-medium">
                Excellent work! You've completed the breathing exercise.
              </p>
              <p className="text-green-600 text-sm mt-1">
                Notice how you feel. This technique gets more effective with practice.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          {phase === 'idle' ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startExercise}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Exercise
            </motion.button>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isActive ? pauseExercise : () => {
                  setIsActive(true);
                }}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center"
              >
                {isActive ? (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Resume
                  </>
                )}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetExercise}
                className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </motion.button>
            </>
          )}
        </div>

        {/* Instructions */}
        {phase === 'idle' && cycles === 0 && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg text-left">
            <h3 className="font-semibold text-gray-800 mb-2">How it works:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Breathe in through your nose for 4 seconds</li>
              <li>• Hold your breath for 7 seconds</li>
              <li>• Exhale completely through your mouth for 8 seconds</li>
              <li>• Repeat for 4 cycles</li>
            </ul>
            <p className="text-xs text-gray-500 mt-3">
              💡 Tip: This technique activates your parasympathetic nervous system, promoting relaxation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}