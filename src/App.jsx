import React, { useState, useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";

import {
  ListTodo,
  Clock,
  Timer,
  Target,
  CalendarDays,
  BarChart3,
  BookOpen,
  Moon,
  Sun,
  Trophy,
  Menu,
  X,
} from "lucide-react";

import { TaskBoard } from "./components/TaskBoard";
import { RoutineManager } from "./components/RoutineManager";
import { PomodoroTimer } from "./components/PomodoroTimer";
import { HabitTracker } from "./components/HabitTracker";
import { CalendarView } from "./components/CalendderView";
import { Analytics } from "./components/Analytics";
import { Journal } from "./components/Journal";
import { GamificationDashboard } from "./components/GamificationDashboard";
import { WeeklyPlan } from "./components/WeeklyPlan";
import { ErrorBoundary } from "./components/ErrorBoundary";

// ---------------- Reusable Navigation Item ----------------
const NavItem = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
      ? "bg-blue-600 text-white shadow-lg"
      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

const AppContent = () => {
  const { currentView, setCurrentView, preferences, updatePreferences } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ---------------- Mobile Bottom Navbar Item ----------------
  const BottomNavItem = ({ icon, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all ${isActive
        ? "text-blue-600"
        : "text-gray-500 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
        }`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );


  useEffect(() => {
    if (preferences.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [preferences.theme]);

  const toggleTheme = () => {
    updatePreferences({
      theme: preferences.theme === "light" ? "dark" : "light",
    });
  };

  // ---------------- Render current view ----------------
  const renderView = () => {
    switch (currentView) {
      case "tasks":
        return <TaskBoard />;
      case "weeklyPlan":
        return <WeeklyPlan />;
      case "routines":
        return <RoutineManager />;
      case "timer":
        return <PomodoroTimer />;
      case "habits":
        return <HabitTracker />;
      case "calendar":
        return <CalendarView />;
      case "analytics":
        return <Analytics />;
      case "journal":
        return <Journal />;
      case "gamification":
        return <GamificationDashboard />;
      default:
        return <TaskBoard />;
    }
  };

  return (
    <div className={`flex h-screen ${preferences.theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>

      {/* ---------------- Sidebar for large screens ---------------- */}
      <aside
        className={`hidden md:flex w-64 flex-col p-4 border-r ${preferences.theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
      >
        <div className="mb-8">
          <h1 className={`text-2xl font-bold mb-1 ${preferences.theme === "dark" ? "text-white" : "text-gray-900"}`}>
            ProductivityHub
          </h1>
          <p className={`text-sm ${preferences.theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Your complete productivity suite
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          <NavItem icon={<ListTodo size={20} />} label="Tasks" isActive={currentView === "tasks"} onClick={() => setCurrentView("tasks")} />
          <NavItem icon={<Clock size={20} />} label="Routines" isActive={currentView === "routines"} onClick={() => setCurrentView("routines")} />
          <NavItem icon={<Timer size={20} />} label="Focus Timer" isActive={currentView === "timer"} onClick={() => setCurrentView("timer")} />
          <NavItem icon={<Target size={20} />} label="Habits" isActive={currentView === "habits"} onClick={() => setCurrentView("habits")} />
          <NavItem icon={<CalendarDays size={20} />} label="Calendar" isActive={currentView === "calendar"} onClick={() => setCurrentView("calendar")} />
          <NavItem icon={<BarChart3 size={20} />} label="Analytics" isActive={currentView === "analytics"} onClick={() => setCurrentView("analytics")} />
          <NavItem icon={<Trophy size={20} />} label="Gamification" isActive={currentView === "gamification"} onClick={() => setCurrentView("gamification")} />
          <NavItem icon={<BookOpen size={20} />} label="Journal" isActive={currentView === "journal"} onClick={() => setCurrentView("journal")} />
          <NavItem icon={<Clock size={20} />} label="Weekly Plan" isActive={currentView === "weeklyPlan"} onClick={() => setCurrentView("weeklyPlan")} />

        </nav>

        {/* Theme Toggle */}
        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${preferences.theme === "dark" ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            {preferences.theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            <span className="font-medium">{preferences.theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>
      </aside>

      {/* ---------------- Mobile Navbar ---------------- */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50 flex items-center justify-between p-4">
        <span className="font-bold text-lg text-gray-900 dark:text-white">ProductivityHub</span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-40 flex flex-col p-4 space-y-2">

          <NavItem icon={<ListTodo size={20} />} label="Tasks" isActive={currentView === "tasks"} onClick={() => { setCurrentView("tasks"); setMobileMenuOpen(false); }} />
          <NavItem icon={<Clock size={20} />} label="Routines" isActive={currentView === "routines"} onClick={() => { setCurrentView("routines"); setMobileMenuOpen(false); }} />
          <NavItem icon={<Timer size={20} />} label="Focus Timer" isActive={currentView === "timer"} onClick={() => { setCurrentView("timer"); setMobileMenuOpen(false); }} />
          <NavItem icon={<Target size={20} />} label="Habits" isActive={currentView === "habits"} onClick={() => { setCurrentView("habits"); setMobileMenuOpen(false); }} />
          <NavItem icon={<CalendarDays size={20} />} label="Calendar" isActive={currentView === "calendar"} onClick={() => { setCurrentView("calendar"); setMobileMenuOpen(false); }} />
          <NavItem icon={<BarChart3 size={20} />} label="Analytics" isActive={currentView === "analytics"} onClick={() => { setCurrentView("analytics"); setMobileMenuOpen(false); }} />
          <NavItem icon={<Trophy size={20} />} label="Gamification" isActive={currentView === "gamification"} onClick={() => { setCurrentView("gamification"); setMobileMenuOpen(false); }} />
          <NavItem icon={<BookOpen size={20} />} label="Journal" isActive={currentView === "journal"} onClick={() => { setCurrentView("journal"); setMobileMenuOpen(false); }} />

          <NavItem icon={<Clock size={20} />} label="Weekly Plan" isActive={currentView === "weeklyPlan"} onClick={() => setCurrentView("weeklyPlan")} />

        </div>
      )}

      {/* ---------------- Main Content ---------------- */}
      <main className="flex-1 overflow-auto pt-16 md:pt-0">{renderView()}</main>

      {/* ---------------- Mobile Bottom Navbar ---------------- */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center p-2">
        <BottomNavItem icon={<ListTodo size={20} />} label="Tasks" isActive={currentView === "tasks"} onClick={() => setCurrentView("tasks")} />
        <BottomNavItem icon={<Target size={20} />} label="Habits" isActive={currentView === "habits"} onClick={() => setCurrentView("habits")} />
        <BottomNavItem icon={<BarChart3 size={20} />} label="Analytics" isActive={currentView === "analytics"} onClick={() => setCurrentView("analytics")} />
        <BottomNavItem icon={<Trophy size={20} />} label="Gamification" isActive={currentView === "gamification"} onClick={() => setCurrentView("gamification")} />
      </nav>

    </div>
  );
};
function App() {
  return (
    <AppProvider>
      <ErrorBoundary>

        <AppContent />

      </ErrorBoundary>

    </AppProvider>
  );
}

export default App;
