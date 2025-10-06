import React from "react";
import { useApp } from "../context/AppContext";
import { CheckCircle, Clock, Timer, Flame, Trophy } from "lucide-react";
import { format, startOfDay, endOfDay } from "date-fns";

export const Home = () => {
    const { tasks, habits, habitCompletions, focusSessions, users } = useApp();
    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);

    // ------------------- Task Stats -------------------
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "completed").length;
    const tasksToday = tasks.filter(
        (t) => t.status === "completed" && t.updatedAt >= todayStart && t.updatedAt <= todayEnd
    ).length;

    // ------------------- Habit Stats -------------------
    const todayHabitCompletions = habitCompletions.filter((hc) =>
        hc.completedDate >= todayStart && hc.completedDate <= todayEnd
    );
    const streak = habits.reduce((max, h) => Math.max(max, h.currentStreak), 0);

    // ------------------- Focus Stats -------------------
    const todayFocusSessions = focusSessions.filter(
        (s) => s.completedAt >= todayStart && s.completedAt <= todayEnd && s.sessionType === "focus"
    );
    const focusHoursToday =
        Math.round(todayFocusSessions.reduce((acc, s) => acc + s.duration, 0) / 60 * 10) / 10;

    // ------------------- Gamification -------------------
    // ------------------- Gamification -------------------
    const totalPoints = (users || []).reduce((acc, u) => acc + (u.points || 0), 0);
    const badgeCount = (users || []).reduce((acc, u) => acc + ((u.badges?.length) || 0), 0);



    return (
        <div className="h-full overflow-y-auto p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard Overview</h1>
                <p className="text-gray-600 mb-6">Quick glance of your productivity stats</p>

                {/* ------------------- Stats Cards ------------------- */}
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-500 text-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle size={24} />
                            <h3 className="font-semibold text-lg">Tasks</h3>
                        </div>
                        <p className="text-3xl font-bold">{totalTasks}</p>
                        <p className="text-sm mt-1">{completedTasks} completed</p>
                    </div>

                    <div className="bg-green-500 text-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock size={24} />
                            <h3 className="font-semibold text-lg">Habits Today</h3>
                        </div>
                        <p className="text-3xl font-bold">{todayHabitCompletions.length}</p>
                        <p className="text-sm mt-1">{streak} day streak</p>
                    </div>

                    <div className="bg-orange-500 text-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Timer size={24} />
                            <h3 className="font-semibold text-lg">Focus Hours</h3>
                        </div>
                        <p className="text-3xl font-bold">{focusHoursToday}</p>
                        <p className="text-sm mt-1">{todayFocusSessions.length} sessions</p>
                    </div>

                    <div className="bg-red-500 text-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Trophy size={24} />
                            <h3 className="font-semibold text-lg">Points & Badges</h3>
                        </div>
                        <p className="text-3xl font-bold">{totalPoints}</p>
                        <p className="text-sm mt-1">{badgeCount} badges earned</p>
                    </div>
                </div>

                {/* ------------------- Recent Tasks ------------------- */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h2 className="font-bold text-xl text-gray-900 mb-4">Recent Tasks Completed</h2>
                    {tasksToday === 0 ? (
                        <p className="text-gray-500 text-sm">No tasks completed today.</p>
                    ) : (
                        <ul className="space-y-2">
                            {tasks
                                .filter((t) => t.status === "completed" && t.updatedAt >= todayStart && t.updatedAt <= todayEnd)
                                .slice(0, 5)
                                .map((task) => (
                                    <li key={task.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                                        <span>{task.title}</span>
                                        <span className="text-sm text-green-600 font-medium">{task.status}</span>
                                    </li>
                                ))}
                        </ul>
                    )}
                </div>

                {/* ------------------- Gamification Progress ------------------- */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h2 className="font-bold text-xl text-gray-900 mb-4">Gamification Progress</h2>
                    <div className="space-y-4">
                        {(users || []).map((user) => (
                            <div key={user.id}>
                                <h4 className="font-semibold text-gray-900">{user.name}</h4>
                                <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
                                    <div
                                        className="bg-blue-500 h-4 rounded-full"
                                        style={{ width: `${Math.min((user.points || 0 / 100) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">{user.points || 0} points</p>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    );
};
