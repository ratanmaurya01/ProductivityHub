import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, Trophy, Star } from 'lucide-react';

export const GamificationDashboard = () => {
  const { tasks, habits, users } = useApp();

  const today = new Date();

  // -------------------------
  // 1. Points & Badges
  // -------------------------
  const taskPoints = tasks.filter(t => t.status === 'completed').length * 5;
  const habitPoints = habits.reduce((acc, h) => acc + (h.currentStreak || 0) * 3, 0);
  const totalPoints = taskPoints + habitPoints;

  const badges = [];
  if (totalPoints >= 50) badges.push('Novice Achiever');
  if (totalPoints >= 150) badges.push('Pro Performer');
  if (totalPoints >= 300) badges.push('Master of Productivity');

  // -------------------------
  // 2. Leaderboard
  // -------------------------
  const leaderboardData = users
    ? users
        .map(user => ({
          ...user,
          points:
            (user.tasksCompleted || 0) * 5 +
            (user.habitsCompleted || 0) * 3 +
            (user.streaks || 0) * 10,
        }))
        .sort((a, b) => b.points - a.points)
    : [];

  // -------------------------
  // 3. Goal Tracking
  // -------------------------
  const weeklyGoal = 20; // Example: weekly goal
  const completedThisWeek = tasks.filter(t => t.status === 'completed').length;
  const progressPercent = Math.min((completedThisWeek / weeklyGoal) * 100, 100);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        <h2 className="font-bold text-gray-900 mb-4">Gamification Dashboard</h2>

        {/* ---------------- Points & Badges ---------------- */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Trophy size={24} /> Points & Badges
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-blue-50 rounded-xl text-blue-700 flex flex-col items-center justify-center">
              <p className="text-xl font-semibold">Total Points</p>
              <p className="text-4xl font-bold">{totalPoints}</p>
            </div>
            <div>
              <p className="font-semibold mb-2">Badges Earned</p>
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
        </div>

        {/* ---------------- Leaderboard ---------------- */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle size={24} /> Leaderboard
          </h3>
          {leaderboardData.length === 0 ? (
            <p className="text-gray-500">No users to display</p>
          ) : (
            <div className="space-y-2">
              {leaderboardData.map((user, index) => (
                <div key={user.id} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span>{index + 1}. {user.name}</span>
                  <span className="font-bold text-blue-600">{user.points} pts</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ---------------- Goal Tracking ---------------- */}
       
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle size={24} /> Weekly Goal
          </h3>
          <p className="mb-2">Tasks Completed: {completedThisWeek}/{weeklyGoal}</p>
          <div className="w-full h-4 bg-gray-200 rounded-full">
            <div
              className="h-4 bg-blue-600 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        
      </div>
    </div>
  );
};
