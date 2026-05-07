import React, { useState } from 'react';
import AppNavbar from '../components/common/AppNavbar';
import { MapPin, Globe, Calendar, Edit2, X, Camera } from 'lucide-react';

const defaultUser = {
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
  <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
    <p className="text-3xl font-bold text-gray-900">{value}</p>
    <p className="text-sm text-gray-400 mt-1">{label}</p>
  </div>
);

/* ─── Edit Profile Modal ─────────────────────────────────────── */
const EditProfileModal = ({ user, onSave, onClose }) => {
  const [form, setForm] = useState({
    name:     user.name,
    email:    user.email,
    bio:      user.bio,
    location: user.location,
    website:  user.website,
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    // Simulate save delay
    await new Promise(r => setTimeout(r, 800));
    onSave(form);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Avatar preview */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={form.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
              <button
                type="button"
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Camera size={13} />
              </button>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{form.name || 'Your Name'}</p>
              <p className="text-xs text-gray-400">Click the camera icon to change photo</p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all resize-none"
            />
          </div>

          {/* Location + Website side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="City, Country"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                name="website"
                value={form.website}
                onChange={handleChange}
                placeholder="www.example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !form.name.trim() || !form.email.trim()}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all
                ${saving || !form.name.trim() || !form.email.trim()
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-900 text-white hover:bg-gray-700 active:scale-[0.98]'}`}
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Profile Page ──────────────────────────────────────────── */
const ProfilePage = () => {
  const [user, setUser] = useState(defaultUser);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
    console.log('Profile updated:', updates);
  };

  const { name, email, avatar, bio, location, website, joined, stats } = user;

  return (
    <div className="app-page">
      <AppNavbar />

      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Banner + Avatar + Name */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 mb-4">
          <div
            className="h-44 w-full"
            style={{ background: 'linear-gradient(135deg, #22c1c3 0%, #3b5bdb 100%)' }}
          />

          <div className="px-6 pb-5">
            <div className="flex items-end justify-between -mt-12">
              <img
                src={avatar}
                alt={name}
                className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
              />
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 active:scale-[0.97] transition-all"
              >
                <Edit2 size={14} />
                Edit Profile
              </button>
            </div>

            <div className="mt-3">
              <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
              <p className="text-sm text-gray-400">{email}</p>
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
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-3">About</h2>
          <p className="text-gray-600 leading-relaxed mb-5">{bio}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <MapPin size={15} className="text-gray-400 flex-shrink-0" />
              {location}
            </span>
            <span className="flex items-center gap-2">
              <Globe size={15} className="text-gray-400 flex-shrink-0" />
              <a href={`https://${website}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                {website}
              </a>
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={15} className="text-gray-400 flex-shrink-0" />
              Joined {joined}
            </span>
          </div>
        </div>

      </div>

      {/* Edit Modal */}
      {isEditing && (
        <EditProfileModal
          user={user}
          onSave={handleSave}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};

export default ProfilePage;
