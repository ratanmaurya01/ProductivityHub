import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  addDays,
} from 'date-fns';
import { ChevronLeft, ChevronRight, CheckCircle, Clock } from 'lucide-react';

// ---------------- Calendar Day Button ----------------
const CalendarDay = ({ date, isCurrentMonth, taskCount, habitCount, isToday, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`min-h-[100px] p-2 border border-gray-200 transition-all hover:bg-gray-50 ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'
        } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div
        className={`text-sm font-semibold mb-2 ${isToday ? 'text-blue-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
          }`}
      >
        {format(date, 'd')}
      </div>

      <div className="space-y-1">
        {taskCount > 0 && (
          <div className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <CheckCircle size={10} />
            <span>{taskCount} tasks</span>
          </div>
        )}
        {habitCount > 0 && (
          <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Clock size={10} />
            <span>{habitCount} habits</span>
          </div>
        )}
      </div>
    </button>
  );
};


// ---------------- Day Detail Modal ----------------


const DayDetailModal = ({ date, onClose }) => {
  const { tasks, habitCompletions, habits } = useApp();
  const dayTasks = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), date));

  const dayHabitCompletions = habitCompletions.filter(hc =>
    isSameDay(new Date(hc.completedDate), date)
  );
  const completedHabits = dayHabitCompletions
    .map(hc => habits.find(h => h.id === hc.habitId))
    .filter(Boolean);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{format(date, 'EEEE, MMMM d, yyyy')}</h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Tasks */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle className="text-blue-600" size={20} /> Tasks ({dayTasks.length})
            </h3>
            {dayTasks.length === 0 ? (
              <p className="text-gray-500 text-sm">No tasks scheduled for this day</p>
            ) : (
              <div className="space-y-2">
                {dayTasks.map(task => (
                  <div key={task.id} className="p-3 bg-gray-50 rounded-lg flex justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{task.title}</h4>
                      {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${task.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : task.status === 'ongoing'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Habits */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="text-green-600" size={20} /> Completed Habits ({completedHabits.length})
            </h3>
            {completedHabits.length === 0 ? (
              <p className="text-gray-500 text-sm">No habits completed on this day</p>
            ) : (
              <div className="space-y-2">
                {completedHabits.map(habit => (
                  <div key={habit?.id} className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900">{habit?.title}</h4>
                    {habit?.description && <p className="text-sm text-gray-600 mt-1">{habit.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------- Calendar View ----------------

export const CalendarView = () => {
  const { tasks, habitCompletions, weeklyPlan, addTask } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // month | week

  // ---------------- Auto-generate weekly plan tasks ----------------


  useEffect(() => {
    if (!weeklyPlan || weeklyPlan.length === 0) return;

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });

    for (let i = 0; i < 7; i++) {
      const day = addDays(start, i);
      const dayName = weekdays[day.getDay()];

      weeklyPlan
        .filter(plan => plan.day === dayName)
        .forEach(plan => {
          const exists = tasks.find(
            t => t.title === plan.title && new Date(t.dueDate).toDateString() === day.toDateString()
          );
          if (!exists) {
            addTask({ title: plan.title, status: 'pending', dueDate: day });
          }
        });
    }
  }, [weeklyPlan, tasks, addTask]);

  // ---------------- Calendar days ----------------
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Weekly view: only current week
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const displayDays = viewMode === 'month' ? calendarDays : weekDays;

  const getTaskCountForDay = date => tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), date)).length;
  const getHabitCountForDay = date => habitCompletions.filter(hc => isSameDay(new Date(hc.completedDate), date)).length;

  const today = new Date();

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Calendar</h2>
            <p className="text-gray-600">View your tasks and habits across time</p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {/* Month navigation */}
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <h3 className="text-xl font-bold min-w-[150px] text-center">{format(currentMonth, 'MMMM yyyy')}</h3>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={24} />
            </button>

            {/* Toggle week/month */}
            <button
              onClick={() => setViewMode(viewMode === 'month' ? 'week' : 'month')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {viewMode === 'month' ? 'Week View' : 'Month View'}
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-7 bg-gray-100">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div
                key={day}
                className="p-4 text-center font-bold text-gray-700 border-b border-gray-200"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {displayDays.map(day => (
              <CalendarDay
                key={day.toISOString()}
                date={day}
                isCurrentMonth={isSameMonth(day, currentMonth)}
                taskCount={getTaskCountForDay(day)}
                habitCount={getHabitCountForDay(day)}
                isToday={isSameDay(day, today)}
                onClick={() => setSelectedDate(day)}
              />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-gray-900 mb-4">Legend</h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 rounded" />
              <span className="text-sm text-gray-600">Tasks scheduled</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 rounded" />
              <span className="text-sm text-gray-600">Habits completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-500 rounded" />
              <span className="text-sm text-gray-600">Today</span>
            </div>
          </div>
        </div>
      </div>
      {/* Day Modal */}
      {selectedDate && <DayDetailModal date={selectedDate} onClose={() => setSelectedDate(null)} />}
    </div>
  );
};

