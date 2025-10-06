import React from 'react';
import { useApp } from '../context/AppContext';

export const Leaderboard = () => {
    const { users } = useApp(); // [{ id, name, tasksCompleted, habitsCompleted, streaks }]

    const leaderboardData = users
        .map(user => ({
            ...user,
            points:
                user.tasksCompleted * 5 +
                user.habitsCompleted * 3 +
                user.streaks * 10,
        }))
        .sort((a, b) => b.points - a.points);

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
            <div className="space-y-2">
                {leaderboardData.map((user, index) => (
                    <div key={user.id} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span>{index + 1}. {user.name}</span>
                        <span className="font-bold text-blue-600">{user.points} pts</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
