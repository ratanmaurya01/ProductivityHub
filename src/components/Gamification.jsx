import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, Trophy, Star } from 'lucide-react';

export const Gamification = () => {
  const { tasks, habits } = useApp();

  // Points calculation
  const taskPoints = tasks.filter(t => t.status === 'completed').length * 5;
  const habitPoints = habits.reduce((acc, h) => acc + (h.currentStreak || 0) * 3, 0);
  const totalPoints = taskPoints + habitPoints;

  // Badges
  const badges = [];
  if (totalPoints >= 50) badges.push('Novice Achiever');
  if (totalPoints >= 150) badges.push('Pro Performer');
  if (totalPoints >= 300) badges.push('Master of Productivity');

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Trophy size={24} /> Gamification
      </h2>

      <div className="mb-4">
        <p className="font-semibold">Total Points:</p>
        <p className="text-3xl font-bold text-blue-600">{totalPoints}</p>
      </div>

      <div>
        <p className="font-semibold mb-2">Badges Earned:</p>
        {badges.length === 0 ? (
          <p className="text-gray-500 text-sm">No badges yet. Keep completing tasks!</p>
        ) : (
          <div className="flex gap-2 flex-wrap">
            {badges.map((badge, index) => (
              <div key={index} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full flex items-center gap-1">
                <Star size={16} /> {badge}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
