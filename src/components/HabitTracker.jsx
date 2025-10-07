import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, CreditCard as Edit2, Trash2, Flame, CheckCircle, Circle, TrendingUp } from 'lucide-react';
import { format, subDays, startOfDay } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const HabitCard = ({ habit, isCompletedToday, onEdit, onDelete, onToggle }) => {
  return (
    <div className={`p-4 rounded-lg border-2 transition-all ${
      isCompletedToday
        ? 'bg-green-50 border-green-300'
        : 'bg-white border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-start gap-3">
        <button onClick={onToggle} className="mt-1">
          {isCompletedToday ? (
            <CheckCircle className="text-green-600" size={28} />
          ) : (
            <Circle className="text-gray-400 hover:text-green-500 transition-colors" size={28} />
          )}
        </button>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className={`font-semibold text-lg ${isCompletedToday ? 'text-gray-500' : 'text-gray-900'}`}>
                {habit.title}
              </h4>
              {habit.description && (
                <p className="text-sm text-gray-600 mt-1">{habit.description}</p>
              )}
            </div>
            <div className="flex gap-1">
              <button onClick={onEdit} className="p-1 text-gray-500 hover:text-blue-600 transition-colors">
                <Edit2 size={16} />
              </button>
              <button onClick={onDelete} className="p-1 text-gray-500 hover:text-red-600 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">
              {habit.frequency}
            </span>

            {habit.currentStreak > 0 && (
              <div className="flex items-center gap-1">
                <Flame className="text-orange-500" size={16} />
                <span className="font-bold text-orange-600">{habit.currentStreak} day streak</span>
              </div>
            )}

            {habit.bestStreak > 0 && (
              <span className="text-xs text-gray-500">
                Best: {habit.bestStreak} days
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const HabitModal = ({ habit, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: habit?.title || '',
    description: habit?.description || '',
    frequency: habit?.frequency || 'daily',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {habit ? 'Edit Habit' : 'New Habit'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Frequency</label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {habit ? 'Update Habit' : 'Create Habit'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const HabitTracker = () => {
  const { habits, habitCompletions, addHabit, updateHabit, deleteHabit, toggleHabitCompletion } = useApp();
  const [modalState, setModalState] = useState({ isOpen: false, habit: null });

  const today = startOfDay(new Date());

  const isHabitCompletedToday = (habitId) => {
    return habitCompletions.some(
      (hc) => hc.habitId === habitId &&
        startOfDay(hc.completedDate).getTime() === today.getTime()
    );
  };

  const handleSaveHabit = (habitData) => {
    if (modalState.habit) {
      updateHabit(modalState.habit.id, habitData);
    } else {
      addHabit(habitData);
    }
  };

  const getLast7DaysData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStart = startOfDay(date);
      const completedCount = habitCompletions.filter(
        (hc) => startOfDay(hc.completedDate).getTime() === dateStart.getTime()
      ).length;

      data.push({
        date: format(date, 'MMM dd'),
        completed: completedCount,
      });
    }
    return data;
  };

  const chartData = getLast7DaysData();
  const totalHabits = habits.length;
  const completedToday = habits.filter(h => isHabitCompletedToday(h.id)).length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-bold text-gray-900 mb-2">Habit Tracker</h2>
            <p className="text-gray-600">Build consistency, one day at a time</p>
          </div>
          <button
            onClick={() => setModalState({ isOpen: true, habit: null })}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Add Habit
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <h3 className="text-sm font-semibold mb-2">Total Habits</h3>
            <p className="text-4xl font-bold">{totalHabits}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <h3 className="text-sm font-semibold mb-2">Completed Today</h3>
            <p className="text-4xl font-bold">{completedToday}/{totalHabits}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <h3 className="text-sm font-semibold mb-2">Completion Rate</h3>
            <p className="text-4xl font-bold">{completionRate}%</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-blue-600" size={24} />
            <h3 className="font-bold text-gray-900 text-lg">7-Day Consistency</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
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
              <Line type="monotone" dataKey="completed" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {habits.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Flame size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">No habits yet. Start building your routine!</p>
            <button
              onClick={() => setModalState({ isOpen: true, habit: null })}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Create First Habit
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                isCompletedToday={isHabitCompletedToday(habit.id)}
                onEdit={() => setModalState({ isOpen: true, habit })}
                onDelete={() => deleteHabit(habit.id)}
                onToggle={() => toggleHabitCompletion(habit.id, today)}
              />
            ))}
          </div>
        )}
      </div>

      {modalState.isOpen && (
        <HabitModal
          habit={modalState.habit}
          onClose={() => setModalState({ isOpen: false, habit: null })}
          onSave={handleSaveHabit}
        />
      )}
    </div>
  );
};
