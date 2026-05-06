import React from 'react';
import AppNavbar from '../components/common/AppNavbar';
import { Home } from 'lucide-react';

const PostsPage = () => (
  <div className="app-page">
    <AppNavbar />
    <div className="max-w-2xl mx-auto px-4 py-12 text-center text-gray-400 dark:text-gray-500">
      <Home size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-700" strokeWidth={1.5} />
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-1">Posts</h2>
      <p className="text-sm">Your feed will appear here once the backend is connected.</p>
    </div>
  </div>
);

export default PostsPage;
