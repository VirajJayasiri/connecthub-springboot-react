import React, { useEffect, useMemo, useState } from "react";
import AppNavbar from "../components/common/AppNavbar";
import RoomPanel from "../components/chat/RoomPanel";
import {
  Search,
  Plus,
  X,
  MessageSquare,
  Mic,
  Video,
  Hash,
  Users,
  Lock,
  Globe,
} from "lucide-react";
import { createRoomApi, deleteRoomApi, fetchRooms } from "../services/roomsApi";

const TYPE_ICON = { text: MessageSquare, voice: Mic, video: Video };
const TYPE_LABEL = {
  text: "Text Chat",
  voice: "Voice Chat",
  video: "Video Chat",
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "text", label: "Text", Icon: MessageSquare },
  { key: "voice", label: "Voice", Icon: Mic },
  { key: "video", label: "Video", Icon: Video },
];

function readCurrentUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const RoomCard = ({ room, isSelected, onSelect, onTerminate, currentUserId }) => {
  const typeKey = (room.type || "text").toLowerCase();
  const Icon = TYPE_ICON[typeKey] || MessageSquare;
  const isHost = room.hostId === currentUserId || room.hostUserId === currentUserId;

  return (
    <button
      type="button"
      onClick={() => onSelect(room)}
      className={`w-full text-left p-4 rounded-xl transition-all duration-300 mb-2 group relative
        ${
          isSelected
            ? "border border-gray-200 dark:border-neutral-800 border-l-[5px] border-l-black dark:border-l-white bg-white dark:bg-neutral-900 shadow-sm"
            : "border border-gray-200 dark:border-neutral-800 bg-white dark:bg-black hover:border-gray-300 dark:hover:border-neutral-700 hover:shadow-sm"
        }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100 text-base">
          <Icon
            size={18}
            className="text-gray-800 dark:text-gray-200"
            strokeWidth={2}
          />
          {room.name}
        </span>
        <div className="flex items-center gap-2">
          {isHost && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTerminate(room.id);
              }}
              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all"
              title="Terminate Room"
            >
              <X size={14} />
            </button>
          )}
          <span className="text-[11px] px-2.5 py-0.5 rounded-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 whitespace-nowrap ml-2">
            {TYPE_LABEL[typeKey]}
          </span>
        </div>
      </div>
      <p className="text-[13px] text-gray-600 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2">
        {room.description}
      </p>
      <div className="flex items-center justify-between text-[12px] text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1.5">
          <Users size={14} /> {room.members || 0} members
        </span>
        <span className="font-medium">{isHost ? "You are Host" : room.privacy || "Public"}</span>
      </div>
    </button>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full text-center px-8 bg-white dark:bg-[#050505] transition-colors duration-500">
    <Hash
      size={56}
      className="text-gray-200 dark:text-gray-700 mb-4"
      strokeWidth={1.5}
    />
    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-1">
      Welcome to Chat Rooms
    </h2>
    <p className="text-sm text-gray-400 dark:text-gray-500">
      Select a room to start chatting or create a new one.
    </p>
  </div>
);

const CreateModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("text");
  const [privacy, setPrivacy] = useState("public");
  const [error, setError] = useState("");

  const handleCreate = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Room name is required.");
      return;
    }

    onCreate({
      name: trimmedName,
      description: description.trim(),
      type,
      privacy,
    });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-4 pt-6 pb-10 sm:py-10 overflow-y-auto overscroll-contain bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md min-h-0 max-h-[min(88dvh,calc(100dvh-4rem))] flex flex-col overflow-hidden rounded-3xl shadow-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-room-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 p-6 md:p-8 pb-4 flex justify-between items-center border-b border-gray-100 dark:border-neutral-800">
          <h2 id="create-room-title" className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Create Chat Room
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-6 md:p-8 space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Room Name</label>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                placeholder="Enter room name"
                className="w-full px-4 py-3 rounded-2xl border border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 text-sm outline-none focus:ring-2 ring-gray-900/5 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Topic</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this room about?"
                rows={3}
                className="w-full px-4 py-3 rounded-2xl border border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 text-sm outline-none focus:ring-2 ring-gray-900/5 transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Room Type</label>
              <div className="space-y-2">
                {[
                  { id: "text", label: "Text Chat", sub: "Send messages", Icon: MessageSquare },
                  { id: "voice", label: "Voice Chat", sub: "Talk with audio", Icon: Mic },
                  {
                    id: "video",
                    label: "Video Chat",
                    sub: "Coming soon",
                    Icon: Video,
                    disabled: true,
                  },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    disabled={t.disabled}
                    onClick={() => !t.disabled && setType(t.id)}
                    className={`w-full flex items-center gap-4 p-3 rounded-2xl border transition-all duration-300 text-left
                      ${t.disabled ? "opacity-40 cursor-not-allowed" : ""}
                      ${type === t.id ? "bg-gray-900 dark:bg-white text-white dark:text-black border-transparent" : "bg-white dark:bg-neutral-800 border-gray-100 dark:border-neutral-800 text-gray-600 dark:text-gray-400 hover:border-gray-200"}`}
                  >
                    <div className={`p-2 rounded-xl ${type === t.id ? "bg-white/10 dark:bg-black/5" : "bg-gray-100 dark:bg-neutral-700"}`}>
                      <t.Icon size={18} />
                    </div>
                    <div>
                      <div className="font-bold text-sm">{t.label}</div>
                      <div className="text-[11px] opacity-60">{t.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Privacy Settings</label>
              <div className="space-y-2">
                {[
                  { id: "public", label: "Public", sub: "Anyone can join", Icon: Globe },
                  { id: "private", label: "Private", sub: "Requires approval to join", Icon: Lock },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPrivacy(p.id)}
                    className={`w-full flex items-center gap-4 p-3 rounded-2xl border transition-all duration-300 text-left
                      ${privacy === p.id ? "bg-gray-900 dark:bg-white text-white dark:text-black border-transparent" : "bg-white dark:bg-neutral-800 border-gray-100 dark:border-neutral-800 text-gray-600 dark:text-gray-400 hover:border-gray-200"}`}
                  >
                    <div className={`p-2 rounded-xl ${privacy === p.id ? "bg-white/10 dark:bg-black/5" : "bg-gray-100 dark:bg-neutral-700"}`}>
                      <p.Icon size={18} />
                    </div>
                    <div>
                      <div className="font-bold text-sm">{p.label}</div>
                      <div className="text-[11px] opacity-60">{p.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          {error && <p className="text-xs font-bold text-red-500">{error}</p>}
        </div>

        <div className="flex-shrink-0 p-6 md:p-8 pt-0 border-t border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <button
            type="button"
            onClick={handleCreate}
            className="w-full py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-bold hover:opacity-90 active:scale-[0.99] transition-all shadow-xl shadow-gray-900/10"
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ChatRoomsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [loadError, setLoadError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const currentUser = useMemo(() => readCurrentUser(), []);
  const currentUserId = currentUser?._id || currentUser?.id || null;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchRooms();
        if (!cancelled) {
          setRooms(list);
          setLoadError(null);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setLoadError("Could not load rooms. Is the backend running and are you logged in?");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreateRoom = async ({ name, description, type }) => {
    if (type === "video") {
      setLoadError("Video rooms are not enabled yet.");
      return;
    }
    try {
      const newRoom = await createRoomApi({ name, description, type });
      setRooms((prev) => [newRoom, ...prev]);
      setSelected(newRoom);
      setFilter(type);
      setSearch("");
      setShowModal(false);
      setLoadError(null);
    } catch (e) {
      console.error(e);
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Could not create room (check room type and login).";
      setLoadError(String(msg));
    }
  };

  const handleTerminateRoom = async (roomId) => {
    if (!window.confirm("Are you sure you want to terminate this room?")) return;
    try {
      await deleteRoomApi(roomId);
      setRooms((prev) => prev.filter((r) => r.id !== roomId));
      if (selected?.id === roomId) setSelected(null);
      setLoadError(null);
    } catch (err) {
      console.error(err);
      setLoadError("Could not delete room.");
    }
  };

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (rooms || []).filter((r) => {
      const rType = (r.type || "text").toLowerCase();
      const rName = (r.name || "").toLowerCase();
      const rDesc = (r.description || "").toLowerCase();

      return (
        (filter === "all" || rType === filter) &&
        (!term || rName.includes(term) || rDesc.includes(term))
      );
    });
  }, [rooms, search, filter]);

  return (
    <div className="app-page flex flex-col">
      <AppNavbar />

      {loadError && (
        <div className="max-w-6xl mx-auto px-4 py-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-b border-red-100 dark:border-red-900">
          {loadError}
        </div>
      )}

      <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-neutral-800 transition-colors duration-500">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2 max-w-sm w-full bg-gray-100 dark:bg-neutral-900 rounded-xl px-3 py-2">
            <Search
              size={15}
              className="text-gray-400 dark:text-gray-500 flex-shrink-0"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chat rooms..."
              className="bg-transparent text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 outline-none w-full min-w-0"
            />
          </div>
          <div className="flex-1" />
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 md:px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-semibold rounded-xl hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors whitespace-nowrap flex-shrink-0"
          >
            <Plus size={15} />{" "}
            <span className="hidden sm:inline">Create Room</span>
          </button>
        </div>
      </div>

      <div
        className="flex-1 flex flex-col md:flex-row max-w-6xl w-full mx-auto px-4 py-4 gap-4"
        style={{ minHeight: 0 }}
      >
        <aside
          className={`w-full md:w-72 flex-shrink-0 flex-col ${selected ? "hidden md:flex" : "flex"}`}
        >
          <div className="mb-3">
            <h2 className="font-bold text-gray-900 dark:text-gray-100 text-base">
              Chat Rooms
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {visible.length} rooms available
            </p>
          </div>

          <div className="flex items-center bg-gray-100/80 dark:bg-neutral-900 p-1 rounded-xl mb-4 w-full border border-transparent dark:border-neutral-800/50">
            {FILTERS.map(({ key, label, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-1 sm:px-2 rounded-lg text-[13px] font-medium transition-all duration-300 ease-out group
                  ${
                    filter === key
                      ? "bg-white dark:bg-gradient-to-b dark:from-neutral-800 dark:to-neutral-900 text-gray-900 dark:text-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_10px_rgba(255,255,255,0.02)] ring-1 ring-black/5 dark:ring-white/10 scale-[1.02]"
                      : "text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-200/60 dark:hover:bg-neutral-800/50"
                  }`}
              >
                {Icon && (
                  <Icon
                    size={14}
                    className={`transition-colors duration-200 ${filter === key ? "text-indigo-500 dark:text-indigo-400" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400"}`}
                  />
                )}
                <span className="truncate">{label}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            {isLoading ? (
              <div className="py-20 text-center opacity-40">
                <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p>Loading rooms...</p>
              </div>
            ) : visible.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center mt-8">
                No rooms found.
              </p>
            ) : (
              visible.map((r) => (
                <RoomCard
                  key={r.id}
                  room={r}
                  isSelected={selected?.id === r.id}
                  onSelect={setSelected}
                  onTerminate={handleTerminateRoom}
                  currentUserId={currentUserId}
                />
              ))
            )}
          </div>
        </aside>

        <div className="hidden md:block w-px bg-gray-200 dark:bg-neutral-800 flex-shrink-0 transition-colors duration-500" />

        <main
          className={`flex-1 bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-sm overflow-hidden flex-col transition-colors duration-500 ${!selected ? "hidden md:flex" : "flex"}`}
          style={{ minHeight: "500px" }}
        >
          {selected ? (
            <RoomPanel key={selected.id} room={selected} onBack={() => setSelected(null)} />
          ) : (
            <EmptyState />
          )}
        </main>
      </div>

      {showModal && (
        <CreateModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateRoom}
        />
      )}
    </div>
  );
}
