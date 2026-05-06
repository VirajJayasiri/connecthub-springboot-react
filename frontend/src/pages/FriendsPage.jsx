import React from 'react';
import AppNavbar from '../components/common/AppNavbar';
import { Users } from 'lucide-react';

const FriendsPage = () => (
  <div className="app-page">
    <AppNavbar />
    <div className="max-w-2xl mx-auto px-4 py-12 text-center text-gray-400">
      <Users size={48} className="mx-auto mb-4 text-gray-300" strokeWidth={1.5} />
      <h2 className="text-xl font-semibold text-gray-700 mb-1">Friends</h2>
      <p className="text-sm">Your friends list will appear here once the backend is connected.</p>
    </div>
  </div>
);

export default FriendsPage;
