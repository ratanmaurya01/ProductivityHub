import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Routes, Route } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import {
  ListTodo, Clock, Timer, Target, CalendarDays, BarChart3, BookOpen, Trophy,
  Settings,
} from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { TaskBoard } from "../TaskBoard";
import { RoutineManager } from "../RoutineManager";
import { PomodoroTimer } from "../PomodoroTimer";
import { HabitTracker } from "../HabitTracker";
import { CalendarView } from "../CalendderView";
import { Analytics } from "../Analytics";
import { Journal } from "../Journal";
import { GamificationDashboard } from "../GamificationDashboard";
import { WeeklyPlan } from "../WeeklyPlan";
import Setting from "../Setting";

export const Layout = () => {
  const { preferences } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const routes = [
    { path: "/tasks", label: "Tasks", icon: <ListTodo size={20} /> },
    { path: "/routines", label: "Routines", icon: <Clock size={20} /> },
    { path: "/timer", label: "Focus Timer", icon: <Timer size={20} /> },
    { path: "/habits", label: "Habits", icon: <Target size={20} /> },
    { path: "/calendar", label: "Calendar", icon: <CalendarDays size={20} /> },
    { path: "/analytics", label: "Analytics", icon: <BarChart3 size={20} /> },
    { path: "/journal", label: "Journal", icon: <BookOpen size={20} /> },
    { path: "/gamification", label: "Gamification", icon: <Trophy size={20} /> },
    { path: "/weeklyPlan", label: "Weekly Plan", icon: <Clock size={20} /> },
    { path: "/setting", label: "Setting", icon: <Settings size={20} /> },


  ];

  const currentPath = location.pathname;

  useEffect(() => {
    if (preferences.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [preferences.theme]);

  const bottomNavItems = routes.slice(0, 4);

  return (
    <div
      className={`flex h-screen ${preferences.theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
    >
      <Sidebar routes={routes} currentPath={currentPath} navigate={navigate} />
      <Header
        routes={routes}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        currentPath={currentPath}
        navigate={navigate}
      />

      <main className="flex-1 overflow-auto pt-16 md:pt-0 pb-20">
        <Routes>
          <Route path="/tasks" element={<TaskBoard />} />
          <Route path="/routines" element={<RoutineManager />} />
          <Route path="/timer" element={<PomodoroTimer />} />
          <Route path="/habits" element={<HabitTracker />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/gamification" element={<GamificationDashboard />} />
          <Route path="/weeklyPlan" element={<WeeklyPlan />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="*" element={<TaskBoard />} />
        </Routes>
      </main>
      <BottomNav items={bottomNavItems} currentPath={currentPath} navigate={navigate} />
    </div>
  );
};
