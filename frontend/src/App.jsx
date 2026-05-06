import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public pages
import LandingPage  from './pages/LandingPage';
import LoginPage    from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// App pages (post-login)
import ChatRoomsPage from './pages/ChatRoomsPage';
import ProfilePage   from './pages/ProfilePage';
import PostsPage     from './pages/PostsPage';
import FriendsPage   from './pages/FriendsPage';

function App() {
  return (
    <Routes>
      {/* ── Public ─────────────────────── */}
      <Route path="/"         element={<LandingPage />}  />
      <Route path="/login"    element={<LoginPage />}    />
      <Route path="/register" element={<RegisterPage />} />

      {/* ── App (post-login) ─────────── */}
      <Route path="/chat"    element={<ChatRoomsPage />} />
      <Route path="/profile" element={<ProfilePage />}  />
      <Route path="/posts"   element={<PostsPage />}    />
      <Route path="/friends" element={<FriendsPage />}  />

      {/* ── Fallback ─────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
