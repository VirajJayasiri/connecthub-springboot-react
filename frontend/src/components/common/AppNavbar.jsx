import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Users, Hash, User, Menu, X } from "lucide-react";
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

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate("/chat")}
          className="flex items-center gap-2 font-bold text-lg text-gray-900 hover:opacity-80 transition-opacity"
        >
          <img
            src={blackLogo}
            alt="ConnectHub"
            className="w-10 h-10 md:w-12 md:h-12 object-contain"
          />
          <span className="text-base md:text-lg font-bold text-gray-900 tracking-wide">
            ConnectHub
          </span>
        </button>

        {/* Desktop Nav links */}
        <nav className="hidden md:flex items-center gap-1">
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

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 -mr-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white absolute w-full shadow-lg">
          <nav className="flex flex-col px-4 py-3 gap-2">
            {navItems.map(({ label, icon: Icon, to }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150
                   ${
                     isActive
                       ? "bg-gray-900 text-white shadow-sm"
                       : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent hover:border-gray-200"
                   }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default AppNavbar;
