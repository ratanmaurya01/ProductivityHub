import React from 'react';
import { useApp } from '../context/AppContext';

export const GoalTracking = () => {
  const { tasks } = useApp();

  // Example: weekly goal 20 tasks
  const weeklyGoal = 20;
  const completedThisWeek = tasks.filter(t => t.status === 'completed').length;
  const progressPercent = Math.min((completedThisWeek / weeklyGoal) * 100, 100);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Weekly Goal</h2>
      <p className="mb-2">Tasks Completed: {completedThisWeek}/{weeklyGoal}</p>
      <div className="w-full h-4 bg-gray-200 rounded-full">
        <div
          className="h-4 bg-blue-600 rounded-full transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
