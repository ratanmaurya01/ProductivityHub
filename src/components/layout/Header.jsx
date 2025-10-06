import React from "react";
import { Menu, X } from "lucide-react";
import { NavItem } from "./NavItem";

export const Header = ({ mobileMenuOpen, setMobileMenuOpen, routes, currentPath, navigate }) => (
  <>
    <div className="md:hidden fixed top-0 left-0 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50 flex items-center justify-between p-4">
      <span className="font-bold text-lg text-gray-900 dark:text-white">ProductivityHub</span>
      <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>

    {mobileMenuOpen && (
      <div className="md:hidden fixed top-16 left-0 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-40 flex flex-col p-4 space-y-2">
        {routes.map((r) => (
          <NavItem
            key={r.path}
            icon={r.icon}
            label={r.label}
            isActive={currentPath === r.path}
            onClick={() => {
              navigate(r.path);
              setMobileMenuOpen(false);
            }}
          />
        ))}
      </div>
    )}
  </>
);
