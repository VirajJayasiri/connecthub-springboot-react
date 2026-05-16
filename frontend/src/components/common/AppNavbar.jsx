import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { Home, Users, Hash, User, Menu, X, Sun, Moon } from "lucide-react";
import blackLogo from "../../assets/images/black_logo.png";
import { API_ORIGIN } from "../../config/env.js";

const navItems = [
  { label: "Posts", icon: Home, to: "/posts" },
  { label: "Friends", icon: Users, to: "/friends" },
  { label: "Chat Rooms", icon: Hash, to: "/chat" },
  { label: "Profile", icon: User, to: "/profile" },
];

const API_BASE = API_ORIGIN;

const AppNavbar = ({ friendsUnreadCount }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const stompClientRef = useRef(null);
  const [localUnread, setLocalUnread] = useState(() => {
    const stored = Number(localStorage.getItem("friendsUnreadCount"));
    return Number.isFinite(stored) ? stored : 0;
  });

  const [theme, setTheme] = useState(() => {
    return (
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
    );
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key !== "friendsUnreadCount") return;
      const nextValue = Number(event.newValue);
      setLocalUnread(Number.isFinite(nextValue) ? nextValue : 0);
    };

    const handleCustom = () => {
      const stored = Number(localStorage.getItem("friendsUnreadCount"));
      setLocalUnread(Number.isFinite(stored) ? stored : 0);
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("friends-unread-update", handleCustom);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("friends-unread-update", handleCustom);
    };
  }, []);

  useEffect(() => {
    if (location.pathname === "/friends") return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const storedUser = localStorage.getItem("user");
    let currentUserId = null;
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        currentUserId = parsed?._id || parsed?.id || null;
      } catch (err) {
        currentUserId = null;
      }
    }

    if (!currentUserId) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(`${API_BASE}/ws?token=${token}`),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe("/user/queue/messages", (message) => {
          const payload = JSON.parse(message.body || "{}");
          if (!payload || payload.senderId === currentUserId) return;
          setLocalUnread((prev) => {
            const nextValue = prev + 1;
            localStorage.setItem("friendsUnreadCount", String(nextValue));
            window.dispatchEvent(new Event("friends-unread-update"));
            return nextValue;
          });
        });
      },
    });

    stompClientRef.current = client;
    client.activate();

    return () => {
      stompClientRef.current = null;
      client.deactivate();
    };
  }, [location.pathname]);

  const displayUnread = useMemo(() => {
    return Number.isFinite(friendsUnreadCount)
      ? friendsUnreadCount
      : localUnread;
  }, [friendsUnreadCount, localUnread]);

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
                <span className="inline-flex items-center gap-2">
                  {label}
                  {label === "Friends" && displayUnread > 0 && (
                    <span className="min-w-5 h-5 px-1.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[11px] font-semibold flex items-center justify-center">
                      {displayUnread > 99 ? "99+" : displayUnread}
                    </span>
                  )}
                </span>
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
                <span className="inline-flex items-center gap-2">
                  {label}
                  {label === "Friends" && displayUnread > 0 && (
                    <span className="min-w-5 h-5 px-1.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[11px] font-semibold flex items-center justify-center">
                      {displayUnread > 99 ? "99+" : displayUnread}
                    </span>
                  )}
                </span>
              </NavLink>
            ))}

            {/* Mobile Theme Toggle */}
            <div className="mt-2 pt-3 border-t border-gray-100 dark:border-neutral-800 flex items-center gap-2 bg-gray-50 dark:bg-neutral-900/50 p-1.5 rounded-xl">
              <button
                onClick={() => {
                  setTheme("light");
                  setIsMobileMenuOpen(false);
                }}
                className={`flex-1 flex justify-center items-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  theme === "light"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Sun size={16} /> Light
              </button>
              <button
                onClick={() => {
                  setTheme("dark");
                  setIsMobileMenuOpen(false);
                }}
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
