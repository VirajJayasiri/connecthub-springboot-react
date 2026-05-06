import React, { useMemo, useState } from 'react';
import AppNavbar from '../components/common/AppNavbar';
import {
  Search, Plus, MessageSquare, Mic, Video, Hash, Users,
} from 'lucide-react';

/* ─── Mock data ───────────────────────────────────────────── */
const ROOMS = [
  { id: 1, name: 'Web Development',  type: 'text',  description: 'Discuss all things web dev - React, Vue, Angular, and more', members: 245, lastActive: '2 weeks ago' },
  { id: 2, name: 'Photography Lovers', type: 'text', description: 'Share your best shots and photography tips', members: 189, lastActive: '1 month ago' },
  { id: 3, name: 'Gaming Voice Chat', type: 'voice', description: 'Voice chat for gamers – drop in and chat while playing', members: 47, lastActive: '3 weeks ago' },
  { id: 4, name: 'Music Jam Session', type: 'voice', description: 'Live music collaboration and jamming', members: 15, lastActive: '5 days ago' },
  { id: 5, name: 'Study Together',    type: 'video', description: 'Video study sessions – stay motivated while learning', members: 28, lastActive: '1 week ago' },
  { id: 6, name: 'Team Standup',      type: 'video', description: 'Daily team video standup meetings', members: 12, lastActive: '2 days ago' },
];

const TYPE_ICON = {
  text:  <MessageSquare size={14} className="text-gray-400" />,
  voice: <Mic            size={14} className="text-gray-400" />,
  video: <Video          size={14} className="text-gray-400" />,
};

const TYPE_LABEL = { text: 'Text Chat', voice: 'Voice Chat', video: 'Video Chat' };

/* ─── Room card ───────────────────────────────────────────── */
const RoomCard = ({ room, isSelected, onSelect }) => (
  <button
    onClick={() => onSelect(room)}
    className={`w-full text-left p-4 rounded-xl border transition-all duration-150 mb-2
      ${isSelected
        ? 'border-gray-900 bg-gray-50 shadow-sm'
        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'}`}
  >
    <div className="flex items-start justify-between mb-2">
      <span className="flex items-center gap-1.5 font-semibold text-gray-900 text-sm">
        {TYPE_ICON[room.type]}
        {room.name}
      </span>
      <span className="text-[11px] px-2 py-0.5 rounded-full border border-gray-200 text-gray-500 whitespace-nowrap ml-2">
        {TYPE_LABEL[room.type]}
      </span>
    </div>

    <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
      {room.description}
    </p>

    <div className="flex items-center justify-between text-xs text-gray-400">
      <span className="flex items-center gap-1">
        <Users size={12} /> {room.members} members
      </span>
      <span className="text-blue-400">{room.lastActive}</span>
    </div>
  </button>
);

/* ─── Filter pill ─────────────────────────────────────────── */
const FilterPill = ({ label, icon: Icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
      ${active ? 'bg-gray-900 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-100'}`}
  >
    {Icon && <Icon size={13} />}
    {label}
  </button>
);

/* ─── Empty / selected state (right panel) ────────────────── */
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full text-center px-8">
    <Hash size={56} className="text-gray-200 mb-4" strokeWidth={1.5} />
    <h2 className="text-xl font-semibold text-gray-700 mb-1">Welcome to Chat Rooms</h2>
    <p className="text-sm text-gray-400">
      Select a room to start chatting or{' '}
      <span className="text-blue-500 cursor-pointer hover:underline">create a new one</span>
    </p>
  </div>
);

const SelectedRoomPanel = ({ room }) => (
  <div className="flex flex-col h-full">
    {/* Header */}
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex items-center gap-2">
        {TYPE_ICON[room.type]}
        <h2 className="font-bold text-gray-900 text-lg">{room.name}</h2>
        <span className="text-xs px-2 py-0.5 rounded-full border border-gray-200 text-gray-500 ml-1">
          {TYPE_LABEL[room.type]}
        </span>
      </div>
      <p className="text-sm text-gray-400 mt-1">{room.description}</p>
      <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
        <Users size={12} /> {room.members} members
      </div>
    </div>

    {/* Chat area placeholder */}
    <div className="flex-1 flex items-center justify-center text-gray-300 text-sm">
      Messages will appear here once the backend is connected.
    </div>

    {/* Input */}
    <div className="px-4 py-3 border-t border-gray-200">
      <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2">
        <input
          className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
          placeholder={`Message #${room.name}...`}
        />
      </div>
    </div>
  </div>
);

/* ─── Main page ───────────────────────────────────────────── */
const FILTERS = [
  { key: 'all',   label: 'All'   },
  { key: 'text',  label: 'Text',  icon: MessageSquare },
  { key: 'voice', label: 'Voice', icon: Mic            },
  { key: 'video', label: 'Video', icon: Video          },
];

const ChatRoomsPage = () => {
  const [search,     setSearch]     = useState('');
  const [filter,     setFilter]     = useState('all');
  const [selected,   setSelected]   = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return ROOMS.filter(r => {
      const matchFilter = filter === 'all' || r.type === filter;
      const matchSearch = !term || r.name.toLowerCase().includes(term) || r.description.toLowerCase().includes(term);
      return matchFilter && matchSearch;
    });
  }, [search, filter]);

  return (
    <div className="app-page flex flex-col">
      <AppNavbar />

      {/* Search + Create bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-sm bg-gray-100 rounded-xl px-3 py-2">
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search chat rooms..."
              className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
            />
          </div>
          <div className="flex-1" />
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 transition-colors"
          >
            <Plus size={15} /> Create Room
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex-1 flex max-w-6xl w-full mx-auto px-4 py-4 gap-4 min-h-0">

        {/* LEFT – sidebar */}
        <aside className="w-80 flex-shrink-0 flex flex-col">
          <div className="mb-3">
            <h2 className="font-bold text-gray-900 text-base">Chat Rooms</h2>
            <p className="text-xs text-gray-400">{visible.length} rooms available</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-3">
            {FILTERS.map(f => (
              <FilterPill
                key={f.key}
                label={f.label}
                icon={f.icon}
                active={filter === f.key}
                onClick={() => setFilter(f.key)}
              />
            ))}
          </div>

          {/* Room list */}
          <div className="flex-1 overflow-y-auto pr-1">
            {visible.length === 0
              ? <p className="text-sm text-gray-400 text-center mt-8">No rooms match your search.</p>
              : visible.map(room => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    isSelected={selected?.id === room.id}
                    onSelect={setSelected}
                  />
                ))
            }
          </div>
        </aside>

        {/* Divider */}
        <div className="w-px bg-gray-200 flex-shrink-0" />

        {/* RIGHT – main panel */}
        <main className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {selected ? <SelectedRoomPanel room={selected} /> : <EmptyState />}
        </main>

      </div>

      {/* Simple Create Room modal */}
      {showCreate && (
        <CreateRoomModal onClose={() => setShowCreate(false)} />
      )}
    </div>
  );
};

/* ─── Create Room modal ───────────────────────────────────── */
const CreateRoomModal = ({ onClose }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('text');

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Create a Room</h2>

        <label className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Study Together"
          className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-gray-900 mb-4"
        />

        <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
        <div className="flex gap-2 mb-6">
          {['text','voice','video'].map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all
                ${type === t ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={onClose} className="flex-1 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700">Create</button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomsPage;
