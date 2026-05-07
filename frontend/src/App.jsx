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

// Auth guard
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* ── Public ─────────────────────── */}
      <Route path="/"         element={<LandingPage />}  />
      <Route path="/login"    element={<LoginPage />}    />
      <Route path="/register" element={<RegisterPage />} />

      {/* ── Protected (requires login) ── */}
      <Route path="/chat"    element={<ProtectedRoute><ChatRoomsPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}  />
      <Route path="/posts"   element={<ProtectedRoute><PostsPage /></ProtectedRoute>}    />
      <Route path="/friends" element={<ProtectedRoute><FriendsPage /></ProtectedRoute>}  />

      {/* ── Fallback ─────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
