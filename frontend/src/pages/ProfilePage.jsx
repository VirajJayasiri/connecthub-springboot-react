import React from 'react';
import AppNavbar from '../components/common/AppNavbar';
import { MapPin, Globe, Calendar, Edit2 } from 'lucide-react';

const mockUser = {
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  avatar: 'https://i.pravatar.cc/150?img=47',
  bio: 'Web developer and designer passionate about building great user experiences. I love traveling, photography, and coffee.',
  location: 'San Francisco, CA',
  website: 'www.alexmorgan.dev',
  joined: 'January 2024',
  stats: { posts: 127, friends: 542, chatRooms: 8 },
};

const StatCard = ({ value, label }) => (
  <div className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 text-center shadow-sm transition-colors duration-200">
    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{label}</p>
  </div>
);

const ProfilePage = () => {
  const { name, email, avatar, bio, location, website, joined, stats } = mockUser;

  return (
    <div className="app-page">
      <AppNavbar />

      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Banner + Avatar + Name */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800 mb-4 transition-colors duration-200">
          {/* Gradient banner */}
          <div
            className="h-44 w-full"
            style={{ background: 'linear-gradient(135deg, #22c1c3 0%, #3b5bdb 100%)' }}
          />

          {/* Avatar row */}
          <div className="px-6 pb-5">
            <div className="flex items-end justify-between -mt-12">
              <img
                src={avatar}
                alt={name}
                className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-900 shadow-md object-cover transition-colors duration-200"
              />
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors">
                <Edit2 size={14} />
                Edit Profile
              </button>
            </div>

            <div className="mt-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{name}</h1>
              <p className="text-sm text-gray-400 dark:text-gray-500">{email}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <StatCard value={stats.posts}     label="Posts"      />
          <StatCard value={stats.friends}   label="Friends"    />
          <StatCard value={stats.chatRooms} label="Chat Rooms" />
        </div>

        {/* About */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm transition-colors duration-200">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">About</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-5">{bio}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-2">
              <MapPin size={15} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
              {location}
            </span>
            <span className="flex items-center gap-2">
              <Globe size={15} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
              <a
                href={`https://${website}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 dark:text-blue-400 hover:underline"
              >
                {website}
              </a>
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={15} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
              Joined {joined}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
