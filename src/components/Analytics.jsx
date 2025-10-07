import React from 'react';

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from "recharts";

import { CheckCircle, Clock, Flame, ListTodo, TrendingUp } from 'lucide-react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { useApp } from '../context/AppContext';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export const Analytics = () => {
  const { tasks, habits, habitCompletions, focusSessions } = useApp();

  const today = new Date();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const tasksCompletedToday = tasks.filter(
    t => t.status === 'completed' && t.updatedAt >= todayStart && t.updatedAt <= todayEnd
  ).length;

  const todayFocusSessions = focusSessions.filter(
    s => s.completedAt >= todayStart && s.completedAt <= todayEnd && s.sessionType === 'focus'
  );
  const focusHoursToday = Math.round(todayFocusSessions.reduce((acc, s) => acc + s.duration, 0) / 60 * 10) / 10;

  const maxStreak = habits.reduce((max, h) => Math.max(max, h.currentStreak), 0);

  const getLast7DaysTaskData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStart = startOfDay(date);
      const dateEnd = endOfDay(date);

      const completed = tasks.filter(
        t => t.status === 'completed' && t.updatedAt >= dateStart && t.updatedAt <= dateEnd
      ).length;

      data.push({
        date: format(date, 'MMM dd'),
        completed,
      });
    }
    return data;
  };

  const getLast7DaysFocusData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStart = startOfDay(date);
      const dateEnd = endOfDay(date);

      const sessions = focusSessions.filter(
        s => s.sessionType === 'focus' && s.completedAt >= dateStart && s.completedAt <= dateEnd
      );
      const minutes = sessions.reduce((acc, s) => acc + s.duration, 0);

      data.push({
        date: format(date, 'EEE'),
        hours: Math.round(minutes / 60 * 10) / 10,
      });
    }
    return data;
  };

  const getTasksByPriority = () => {
    const priorities = ['low', 'medium', 'high', 'urgent'];
    return priorities.map(priority => ({
      name: priority.charAt(0).toUpperCase() + priority.slice(1),
      value: tasks.filter(t => t.priority === priority).length,
    }));
  };

  const getTasksByStatus = () => {
    return [
      { name: 'Pending', value: tasks.filter(t => t.status === 'pending').length },
      { name: 'Ongoing', value: tasks.filter(t => t.status === 'ongoing').length },
      { name: 'Completed', value: tasks.filter(t => t.status === 'completed').length },
    ];
  };

  const taskCompletionData = getLast7DaysTaskData();
  const focusTimeData = getLast7DaysFocusData();
  const priorityData = getTasksByPriority();
  const statusData = getTasksByStatus();

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
          <p className="text-gray-600">Track your productivity and progress</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <ListTodo size={24} />
              <h3 className="font-semibold">Total Tasks</h3>
            </div>
            <p className="text-4xl font-bold">{totalTasks}</p>
            <p className="text-sm text-blue-100 mt-2">{completedTasks} completed</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle size={24} />
              <h3 className="font-semibold">Tasks Done Today</h3>
            </div>
            <p className="text-4xl font-bold">{tasksCompletedToday}</p>
            <p className="text-sm text-green-100 mt-2">{format(today, 'MMMM d')}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Clock size={24} />
              <h3 className="font-semibold">Focus Hours Today</h3>
            </div>
            <p className="text-4xl font-bold">{focusHoursToday}</p>
            <p className="text-sm text-orange-100 mt-2">{todayFocusSessions.length} sessions</p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Flame size={24} />
              <h3 className="font-semibold">Habit Streak</h3>
            </div>
            <p className="text-4xl font-bold">{maxStreak}</p>
            <p className="text-sm text-red-100 mt-2">days in a row</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-blue-600" size={24} />
              <h3 className="font-bold text-gray-900 text-lg">Task Completion (7 Days)</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={taskCompletionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
                <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="completed" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="text-orange-600" size={24} />
              <h3 className="font-bold text-gray-900 text-lg">Focus Time (7 Days)</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={focusTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
                <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Line type="monotone" dataKey="hours" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-4">Tasks by Priority</h3>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-4">Tasks by Status</h3>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
