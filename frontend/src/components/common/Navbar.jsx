import { NavLink } from "react-router-dom";
import { FileText, Users, MessageCircle, User, Hash } from "lucide-react";

const navItems = [
  { to: "/posts", label: "Posts", icon: FileText },
  { to: "/friends", label: "Friends", icon: Users },
  { to: "/chat-rooms", label: "Chat Rooms", icon: MessageCircle },
  { to: "/profile", label: "Profile", icon: User },
];

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="logo">
          <span className="logo-mark" aria-hidden="true">
            <Hash size={18} />
          </span>
          <span className="logo-text">ConnectHub</span>
        </div>
        <nav className="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
