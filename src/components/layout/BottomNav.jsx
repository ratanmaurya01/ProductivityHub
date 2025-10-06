import React from "react";

export const BottomNav = ({ items, currentPath, navigate }) => (
  <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center p-2 z-50">
    {items.map((item) => (
      <button
        key={item.path}
        onClick={() => navigate(item.path)}
        className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all ${
          currentPath === item.path
            ? "text-blue-600"
            : "text-gray-500 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
        }`}
      >
        {item.icon}
        <span className="text-xs mt-1">{item.label}</span>
      </button>
    ))}
  </nav>
);
