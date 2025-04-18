'use client';
import React from 'react';
import { useStreakTracker } from '../hooks/useStreakTracker';

const StreakDisplay = () => {
  const { streak, xp } = useStreakTracker();

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md text-center">
      <h2 className="text-xl font-semibold">🔥 Daily Streak</h2>
      <p className="text-3xl text-orange-500 font-bold mt-2">{streak} days</p>
      <p className="text-sm text-gray-500 mt-1">Total XP: {xp}</p>
    </div>
  );
};

export default StreakDisplay;
