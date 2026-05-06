import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Users, Hash, User } from "lucide-react";
import blackLogo from "../../assets/images/black_logo.png";

const navItems = [
  { label: "Posts", icon: Home, to: "/posts" },
  { label: "Friends", icon: Users, to: "/friends" },
  { label: "Chat Rooms", icon: Hash, to: "/chat" },
  { label: "Profile", icon: User, to: "/profile" },
];

const AppNavbar = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate("/chat")}
          className="flex items-center gap-2 font-bold text-lg text-gray-900 hover:opacity-80 transition-opacity"
        >
          <img
            src={blackLogo}
            alt="ConnectHub"
            className="w-12 h-12 object-contain"
          />
          <span className="text-lg font-bold text-gray-900 tracking-wide">
            ConnectHub
          </span>
        </button>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {navItems.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150
                 ${
                   isActive
                     ? "bg-gray-900 text-white"
                     : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                 }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default AppNavbar;
