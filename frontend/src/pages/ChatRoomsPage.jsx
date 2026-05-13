import React, { useMemo, useState } from "react";
import AppNavbar from "../components/common/AppNavbar";
import {
  Search,
  Plus,
  X,
  MessageSquare,
  Mic,
  Video,
  Hash,
  Users,
  ArrowLeft,
  Send,
  Lock,
  Globe,
  Monitor,
} from "lucide-react";
import VoiceRoom from "../components/chat/VoiceRoom";

/* ─── Mock data ─────────────────────────────────────────────── */
const ROOMS = [
  {
    id: 1,
    name: "Web Development",
    type: "text",
    description: "Discuss all things web dev - React, Vue, Angular, and more",
    members: 245,
    lastActive: "2 weeks ago",
  },
  {
    id: 2,
    name: "Photography Lovers",
    type: "text",
    description: "Share your best shots and photography tips",
    members: 189,
    lastActive: "1 month ago",
  },
  {
    id: 3,
    name: "Gaming Voice Chat",
    type: "voice",
    description: "Voice chat for gamers – drop in and chat while playing",
    members: 47,
    lastActive: "3 weeks ago",
  },
  {
    id: 4,
    name: "Music Jam Session",
    type: "voice",
    description: "Live music collaboration and jamming",
    members: 15,
    lastActive: "5 days ago",
  },
  {
    id: 5,
    name: "Study Together",
    type: "video",
    description: "Video study sessions – stay motivated while learning",
    members: 28,
    lastActive: "1 week ago",
  },
  {
    id: 6,
    name: "Team Standup",
    type: "video",
    description: "Daily team video standup meetings",
    members: 12,
    lastActive: "2 days ago",
  },
];

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

/* ─── Sub-components ─────────────────────────────────────────── */
const RoomCard = ({ room, isSelected, onSelect }) => {
  const Icon = TYPE_ICON[room.type];
  return (
    <button
      onClick={() => onSelect(room)}
      className={`w-full text-left p-4 rounded-xl transition-all duration-300 mb-2
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
        <span className="text-[11px] px-2.5 py-0.5 rounded-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 whitespace-nowrap ml-2">
          {TYPE_LABEL[room.type]}
        </span>
      </div>
      <p className="text-[13px] text-gray-600 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2">
        {room.description}
      </p>
      <div className="flex items-center justify-between text-[12px] text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1.5">
          <Users size={14} /> {room.members} members
        </span>
        <span>{room.lastActive}</span>
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
      Select a room to start chatting or{" "}
      <span className="text-blue-500 cursor-pointer hover:underline">
        create a new one
      </span>
    </p>
  </div>
);

const RoomPanel = ({ room, onBack }) => {
  const Icon = TYPE_ICON[room.type];
  const [isJoined, setIsJoined] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Avery",
      text: "Welcome everyone! Share your latest tips.",
      time: "9:12 AM",
    },
    {
      id: 2,
      sender: "Jordan",
      text: "Just shipped a new React layout for a client.",
      time: "9:15 AM",
    },
  ]);
  const [text, setText] = useState("");

  const send = () => {
    const trimmed = text.trim();
    if (!trimmed || room.type !== "text") return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "You",
        text: trimmed,
        time: new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
      },
    ]);
    setText("");
  };

  if (isJoined && (room.type === "voice" || room.type === "video")) {
    return <VoiceRoom room={room} onLeave={() => setIsJoined(false)} />;
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#050505] transition-colors duration-500">
      <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-black transition-colors duration-500">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="md:hidden p-1.5 -ml-2 mr-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <Icon
            size={16}
            className="text-gray-400 dark:text-gray-500 flex-shrink-0"
          />
          <h2 className="font-bold text-gray-900 dark:text-gray-100 text-base md:text-lg truncate">
            {room.name}
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 ml-1 whitespace-nowrap hidden sm:inline-block">
            {TYPE_LABEL[room.type]}
          </span>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 line-clamp-1">
          {room.description}
        </p>
        <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mt-1">
          <Users size={12} /> {room.members} members
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-3">
        {room.type === "text" ? (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === "You" ? "flex-row-reverse" : ""}`}
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400">
                {m.sender[0]}
              </div>
              <div
                className={`max-w-xs ${m.sender === "You" ? "items-end" : ""} flex flex-col`}
              >
                <span className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                  {m.sender} · {m.time}
                </span>
                <div
                  className={`px-3 py-2 rounded-xl text-sm ${m.sender === "You" ? "bg-gray-900 dark:bg-white text-white dark:text-black" : "bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200"}`}
                >
                  {m.text}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-20 h-20 rounded-full mb-6 flex items-center justify-center shadow-inner bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 transition-colors duration-500">
              <Icon size={40} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {room.type === "voice" ? "Voice Channel" : "Video Channel"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-8 leading-relaxed">
              {room.type === "voice"
                ? "Join this voice channel to talk with other members in real-time. Make sure your microphone is connected."
                : "Join this video channel to collaborate face-to-face. Make sure your camera and microphone are ready."}
            </p>
            <button 
              onClick={() => setIsJoined(true)}
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm bg-gray-900 dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 ring-gray-900/20 hover:ring-4"
            >
              <Icon size={18} strokeWidth={2} />
              Join {room.type === "voice" ? "Voice" : "Video"} Room
            </button>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-3 md:px-4 py-3 border-t border-gray-200 dark:border-neutral-800 bg-white dark:bg-black transition-colors duration-500">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-neutral-900 rounded-xl px-3 md:px-4 py-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 outline-none"
            placeholder={
              room.type === "text"
                ? `Message #${room.name}...`
                : "Text messaging is unavailable in this room"
            }
            disabled={room.type !== "text"}
          />
          {room.type === "text" && (
            <button
              onClick={send}
              disabled={!text.trim()}
              className="p-1.5 bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-gray-900 dark:disabled:hover:bg-white"
              title="Send message"
            >
              <Send size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

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
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-transparent dark:border-neutral-800 animate-in zoom-in-95 duration-300">
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Create Chat Room</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Room Name</label>
              <input
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
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
                  { id: "video", label: "Video Chat", sub: "Video calls", Icon: Video },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setType(t.id)}
                    className={`w-full flex items-center gap-4 p-3 rounded-2xl border transition-all duration-300 text-left
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
          </div>

          {error && <p className="mt-4 text-xs font-bold text-red-500">{error}</p>}
        </div>

        <div className="p-6 md:p-8 pt-0">
          <button
            onClick={handleCreate}
            className="w-full py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-gray-900/10"
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Page ─────────────────────────────────────────────── */
export default function ChatRoomsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rooms, setRooms] = useState(ROOMS);

  const handleCreateRoom = ({ name, description, type }) => {
    const newRoom = {
      id: Date.now(),
      name,
      description,
      type,
      members: 1,
      lastActive: "Just now",
    };

    setRooms((prev) => [newRoom, ...prev]);
    setSelected(newRoom);
    setFilter(type);
    setSearch("");
    setShowModal(false);
  };

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rooms.filter(
      (r) =>
        (filter === "all" || r.type === filter) &&
        (!term ||
          r.name.toLowerCase().includes(term) ||
          r.description.toLowerCase().includes(term)),
    );
  }, [rooms, search, filter]);

  return (
    <div className="app-page flex flex-col">
      <AppNavbar />

      {/* Search + Create bar */}
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
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 md:px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-semibold rounded-xl hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors whitespace-nowrap flex-shrink-0"
          >
            <Plus size={15} />{" "}
            <span className="hidden sm:inline">Create Room</span>
          </button>
        </div>
      </div>

      {/* Two-column body */}
      <div
        className="flex-1 flex flex-col md:flex-row max-w-6xl w-full mx-auto px-4 py-4 gap-4"
        style={{ minHeight: 0 }}
      >
        {/* LEFT sidebar */}
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

          {/* Filter pills */}
          <div className="flex items-center bg-gray-100/80 dark:bg-neutral-900 p-1 rounded-xl mb-4 w-full border border-transparent dark:border-neutral-800/50">
            {FILTERS.map(({ key, label, Icon }) => (
              <button
                key={key}
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

          {/* Room list */}
          <div className="flex-1 overflow-y-auto pr-1">
            {visible.length === 0 ? (
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
                />
              ))
            )}
          </div>
        </aside>

        {/* Divider */}
        <div className="hidden md:block w-px bg-gray-200 dark:bg-neutral-800 flex-shrink-0 transition-colors duration-500" />

        {/* RIGHT panel */}
        <main
          className={`flex-1 bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-sm overflow-hidden flex-col transition-colors duration-500 ${!selected ? "hidden md:flex" : "flex"}`}
          style={{ minHeight: "500px" }}
        >
          {selected ? (
            <RoomPanel
              key={selected.id}
              room={selected}
              onBack={() => setSelected(null)}
            />
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
