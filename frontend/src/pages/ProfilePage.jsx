import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppNavbar from "../components/common/AppNavbar";
import {
  MapPin,
  Globe,
  Calendar,
  Edit2,
  X,
  Camera,
  LogOut,
  Loader2,
  Trash2,
} from "lucide-react";
import axios from "axios";

const API_BASE = "http://localhost:8080";

const StatCard = ({ value, label }) => (
  <div className="flex-1 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 text-center shadow-sm">
    <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{label}</p>
  </div>
);

/* ─── Edit Profile Modal ─────────────────────────────────────── */
const EditProfileModal = ({ user, onSave, onClose, onProfileImageUpdated }) => {
  const [form, setForm] = useState({
    name: user.fullName || "",
    email: user.email || "",
    bio: user.bio || "",
    location: user.location || "",
    website: user.website || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [profileFile, setProfileFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (profilePreview) URL.revokeObjectURL(profilePreview);
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleCoverSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (profilePreview) URL.revokeObjectURL(profilePreview);
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [profilePreview, coverPreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in.");
      setSaving(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("fullName", form.name.trim());
      formData.append("email", form.email.trim());
      formData.append("bio", form.bio.trim());
      formData.append("location", form.location.trim());
      formData.append("website", form.website.trim());
      if (profileFile) formData.append("profileImage", profileFile);
      if (coverFile) formData.append("coverImage", coverFile);

      const response = await axios.put(`${API_BASE}/api/auth/me`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      onSave(response.data);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  const avatarUrl =
    profilePreview ||
    user.profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || "U")}&background=random&size=64`;
  const coverUrl = coverPreview || user.coverImage || "";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border dark:border-neutral-800">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-neutral-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900/40">
              <p className="text-sm text-rose-600 dark:text-rose-400 font-medium">
                {error}
              </p>
            </div>
          )}

          {/* Cover preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cover Photo
            </label>
            <div className="relative">
              <div className="h-28 w-full rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-800">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500" />
                )}
              </div>
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="absolute bottom-2 right-2 px-3 py-1.5 rounded-lg bg-gray-900/90 text-white text-xs font-medium hover:bg-gray-900"
              >
                Change Cover
              </button>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverSelect}
              />
            </div>
          </div>

          {/* Avatar preview */}
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoSelect}
            />
            <div className="relative">
              <img
                src={avatarUrl}
                alt={form.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-neutral-800"
              />
              <button
                type="button"
                onClick={() => profileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
              >
                {uploadingPhoto ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Camera size={13} />
                )}
              </button>
              <input
                ref={profileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileSelect}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {form.name || "Your Name"}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Click the camera icon to change photo
              </p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-800 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:border-gray-900 dark:focus:border-white focus:ring-1 focus:ring-gray-900 dark:focus:ring-white transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-800 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:border-gray-900 dark:focus:border-white focus:ring-1 focus:ring-gray-900 dark:focus:ring-white transition-all"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-800 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:border-gray-900 dark:focus:border-white focus:ring-1 focus:ring-gray-900 dark:focus:ring-white transition-all resize-none"
            />
          </div>

          {/* Location + Website side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="City, Country"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-800 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:border-gray-900 dark:focus:border-white focus:ring-1 focus:ring-gray-900 dark:focus:ring-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Website
              </label>
              <input
                name="website"
                value={form.website}
                onChange={handleChange}
                placeholder="www.example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-800 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:border-gray-900 dark:focus:border-white focus:ring-1 focus:ring-gray-900 dark:focus:ring-white transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-800 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !form.name.trim() || !form.email.trim()}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all
                ${
                  saving || !form.name.trim() || !form.email.trim()
                    ? "bg-gray-200 dark:bg-neutral-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                    : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200 active:scale-[0.98]"
                }`}
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteAccountModal = ({ onConfirm, onClose, loading, error }) => {
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onConfirm(password);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border dark:border-neutral-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-neutral-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Delete account</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This action is permanent. Enter your password to confirm.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-800 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:border-gray-900 dark:focus:border-white focus:ring-1 focus:ring-gray-900 dark:focus:ring-white transition-all"
            />
            {error && <p className="text-xs text-rose-500 mt-2">{error}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-800 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !password.trim()}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all
                ${
                  loading || !password.trim()
                    ? "bg-gray-200 dark:bg-neutral-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                    : "bg-rose-600 text-white hover:bg-rose-500 active:scale-[0.98]"
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting...
                </span>
              ) : (
                "Delete account"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Profile Page ──────────────────────────────────────────── */
const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch the logged-in user's profile from the API
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await axios.get(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
      } catch (err) {
        // Token is invalid or expired — clear storage and redirect
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSave = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const handleProfileImageUpdated = (url) => {
    setUser((prev) => (prev ? { ...prev, profileImage: url } : prev));
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const parsed = JSON.parse(raw);
        localStorage.setItem('user', JSON.stringify({ ...parsed, profileImage: url }));
      }
    } catch {
      /* ignore */
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const handleDeleteAccount = async (password) => {
    if (!password.trim()) {
      setDeleteError("Password is required");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      handleLogout();
      return;
    }

    setDeleteLoading(true);
    setDeleteError("");

    try {
      await axios.delete(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { password },
      });

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    } catch (err) {
      setDeleteError(
        err?.response?.data?.message || "Unable to delete account",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="app-page">
        <AppNavbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={32} className="text-gray-400 dark:text-gray-600 animate-spin" />
            <p className="text-sm text-gray-400 dark:text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const avatarUrl =
    user.profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.username || "U")}&background=6366f1&color=fff&size=150`;
  const coverUrl = user.coverImage || "";
  const websiteHref = user.website
    ? user.website.startsWith("http")
      ? user.website
      : `https://${user.website}`
    : "";

  return (
    <div className="app-page">
      <AppNavbar />

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Banner + Avatar + Name */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-neutral-800 mb-4">
          <div
            className="h-44 w-full"
            style={
              coverUrl
                ? {
                    backgroundImage: `url(${coverUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : {
                    background: "linear-gradient(135deg, #22c1c3 0%, #3b5bdb 100%)",
                  }
            }
          />

          <div className="px-6 pb-5">
            <div className="flex items-end justify-between -mt-12">
              <img
                src={avatarUrl}
                alt={user.fullName || user.username}
                className="w-24 h-24 rounded-full border-4 border-white dark:border-neutral-900 shadow-md object-cover"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-200 active:scale-[0.97] transition-all"
                >
                  <Edit2 size={14} />
                  Edit Profile
                </button>
                <button
                  onClick={() => {
                    setDeleteError("");
                    setIsDeleting(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-sm font-medium hover:bg-rose-50 dark:hover:bg-rose-950/20 active:scale-[0.97] transition-all"
                >
                  <Trash2 size={14} />
                  Delete Account
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-neutral-800 text-gray-600 dark:text-gray-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-800 active:scale-[0.97] transition-all"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            </div>

            <div className="mt-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.fullName || user.username}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <StatCard value={user.stats?.posts || 0} label="Posts" />
          <StatCard value={user.stats?.friends || 0} label="Friends" />
          <StatCard value={user.stats?.chatRooms || 0} label="Chat Rooms" />
        </div>

        {/* About */}
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">About</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-5">
            {user.bio || 'No bio yet. Click "Edit Profile" to add one.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-500 dark:text-gray-400">
            {user.location && (
              <span className="flex items-center gap-2">
                <MapPin size={15} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
                {user.location}
              </span>
            )}
            {user.website && (
              <span className="flex items-center gap-2">
                <Globe size={15} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
                <a
                  href={websiteHref}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 dark:text-blue-400 hover:underline"
                >
                  {user.website}
                </a>
              </span>
            )}
            <span className="flex items-center gap-2">
              <Calendar size={15} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
              Member
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
          onProfileImageUpdated={handleProfileImageUpdated}
        />
      )}

      {isDeleting && (
        <DeleteAccountModal
          onConfirm={handleDeleteAccount}
          onClose={() => setIsDeleting(false)}
          loading={deleteLoading}
          error={deleteError}
        />
      )}
    </div>
  );
};

export default ProfilePage;
