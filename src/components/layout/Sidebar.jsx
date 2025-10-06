import React from "react";
import { Sun, Moon } from "lucide-react";
import { NavItem } from "./NavItem";
import { useApp } from "../../context/AppContext";

export const Sidebar = ({ routes, currentPath, navigate }) => {
  const { preferences, updatePreferences } = useApp();

  const toggleTheme = () => {
    updatePreferences({
      theme: preferences.theme === "light" ? "dark" : "light",
    });
  };

  return (
    <aside
      className={`hidden md:flex w-64 flex-col p-4 border-r ${
        preferences.theme === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="mb-8">
        <h1
          className={`text-2xl font-bold mb-1 ${
            preferences.theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          ProductivityHub
        </h1>
        <p
          className={`text-sm ${
            preferences.theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Your complete productivity suite
        </p>
      </div>

      <nav className="space-y-2 flex-1">
        {routes.map((r) => (
          <NavItem
            key={r.path}
            icon={r.icon}
            label={r.label}
            isActive={currentPath === r.path}
            onClick={() => navigate(r.path)}
          />
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            preferences.theme === "dark"
              ? "text-gray-300 hover:bg-gray-700"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {preferences.theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          <span className="font-medium">
            {preferences.theme === "dark" ? "Light Mode" : "Dark Mode"}
          </span>
        </button>
      </div>
    </aside>
  );
};
