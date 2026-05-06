import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Users, Hash, User, Menu, X, Sun, Moon } from "lucide-react";
import blackLogo from "../../assets/images/black_logo.png";

const navItems = [
  { label: "Posts", icon: Home, to: "/posts" },
  { label: "Friends", icon: Users, to: "/friends" },
  { label: "Chat Rooms", icon: Hash, to: "/chat" },
  { label: "Profile", icon: User, to: "/profile" },
];

const AppNavbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || 
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-black border-b border-gray-200 dark:border-neutral-800 shadow-sm transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate("/chat")}
          className="flex items-center gap-2 font-bold text-lg text-gray-900 dark:text-white hover:opacity-80 transition-opacity"
        >
          <img
            src={blackLogo}
            alt="ConnectHub"
            className="w-10 h-10 md:w-12 md:h-12 object-contain dark:invert"
          />
          <span className="text-base md:text-lg font-bold text-gray-900 dark:text-white tracking-wide">
            ConnectHub
          </span>
        </button>

        {/* Desktop Nav and Theme */}
        <div className="hidden md:flex items-center gap-4">
          <nav className="flex items-center gap-1">
            {navItems.map(({ label, icon: Icon, to }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150
                   ${
                     isActive
                       ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm"
                       : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                   }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Theme Toggle Buttons */}
          <div className="flex items-center bg-gray-100 dark:bg-neutral-900 p-1 rounded-full border border-gray-200 dark:border-neutral-800">
            <button
              onClick={() => setTheme("light")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                theme === "light"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Sun size={14} /> Light
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gray-900 dark:bg-neutral-800 text-white shadow-sm ring-1 ring-white/10"
                  : "text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Moon size={14} /> Dark
            </button>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -mr-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-neutral-800 bg-white dark:bg-black absolute w-full shadow-lg">
          <nav className="flex flex-col px-4 py-3 gap-2">
            {navItems.map(({ label, icon: Icon, to }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
                   ${
                     isActive
                       ? "bg-gray-900 dark:bg-neutral-800 text-white dark:text-white shadow-sm"
                       : "text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-900 border border-transparent"
                   }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
            
            {/* Mobile Theme Toggle */}
            <div className="mt-2 pt-3 border-t border-gray-100 dark:border-neutral-800 flex items-center gap-2 bg-gray-50 dark:bg-neutral-900/50 p-1.5 rounded-xl">
              <button
                onClick={() => { setTheme("light"); setIsMobileMenuOpen(false); }}
                className={`flex-1 flex justify-center items-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  theme === "light"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Sun size={16} /> Light
              </button>
              <button
                onClick={() => { setTheme("dark"); setIsMobileMenuOpen(false); }}
                className={`flex-1 flex justify-center items-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-gray-900 text-white shadow-sm dark:bg-neutral-800 ring-1 ring-white/10"
                    : "text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Moon size={16} /> Dark
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default AppNavbar;
