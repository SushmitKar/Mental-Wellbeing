import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface XPProgressProps {
  xp: number;
  level: number;
  xpForNextLevel: number;
  recentXPGain?: number;
}

export default function XPProgress({ xp, level, xpForNextLevel, recentXPGain }: XPProgressProps) {
  const [showXPGain, setShowXPGain] = useState(false);
  const progress = ((xp % 100) / 100) * 100; // Convert to percentage

  useEffect(() => {
    if (recentXPGain) {
      setShowXPGain(true);
      const timer = setTimeout(() => setShowXPGain(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [recentXPGain]);

  return (
    <div className="relative w-full max-w-md mx-auto p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Level {level}</span>
        <span className="text-sm text-gray-500">{xp % 100}/{100} XP</span>
      </div>
      
      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <AnimatePresence>
        {showXPGain && recentXPGain && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute -top-8 right-0 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium"
          >
            +{recentXPGain} XP
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-2 text-center">
        <span className="text-xs text-gray-500">
          {100 - (xp % 100)} XP until next level
        </span>
      </div>
    </div>
  );
} 