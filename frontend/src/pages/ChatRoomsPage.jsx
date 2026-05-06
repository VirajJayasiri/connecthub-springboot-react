import React, { useMemo, useState } from 'react';
import AppNavbar from '../components/common/AppNavbar';
import { Search, Plus, MessageSquare, Mic, Video, Hash, Users, ArrowLeft, Send } from 'lucide-react';

/* ─── Mock data ─────────────────────────────────────────────── */
const ROOMS = [
  { id: 1, name: 'Web Development',   type: 'text',  description: 'Discuss all things web dev - React, Vue, Angular, and more', members: 245, lastActive: '2 weeks ago' },
  { id: 2, name: 'Photography Lovers', type: 'text',  description: 'Share your best shots and photography tips',                   members: 189, lastActive: '1 month ago' },
  { id: 3, name: 'Gaming Voice Chat', type: 'voice', description: 'Voice chat for gamers – drop in and chat while playing',       members:  47, lastActive: '3 weeks ago' },
  { id: 4, name: 'Music Jam Session', type: 'voice', description: 'Live music collaboration and jamming',                          members:  15, lastActive: '5 days ago'  },
  { id: 5, name: 'Study Together',    type: 'video', description: 'Video study sessions – stay motivated while learning',          members:  28, lastActive: '1 week ago'  },
  { id: 6, name: 'Team Standup',      type: 'video', description: 'Daily team video standup meetings',                             members:  12, lastActive: '2 days ago'  },
];

const TYPE_ICON  = { text: MessageSquare, voice: Mic, video: Video };
const TYPE_LABEL = { text: 'Text Chat',   voice: 'Voice Chat', video: 'Video Chat' };

const FILTERS = [
  { key: 'all',   label: 'All'   },
  { key: 'text',  label: 'Text',  Icon: MessageSquare },
  { key: 'voice', label: 'Voice', Icon: Mic           },
  { key: 'video', label: 'Video', Icon: Video         },
];

/* ─── Sub-components ─────────────────────────────────────────── */
const RoomCard = ({ room, isSelected, onSelect }) => {
  const Icon = TYPE_ICON[room.type];
  return (
    <button
      onClick={() => onSelect(room)}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-150 mb-2
        ${isSelected
          ? 'border-gray-900 bg-gray-50 shadow-sm'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center gap-1.5 font-semibold text-gray-900 text-sm">
          <Icon size={14} className="text-gray-400" />
          {room.name}
        </span>
        <span className="text-[11px] px-2 py-0.5 rounded-full border border-gray-200 text-gray-500 whitespace-nowrap ml-2">
          {TYPE_LABEL[room.type]}
        </span>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{room.description}</p>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1"><Users size={12} /> {room.members} members</span>
        <span className="text-blue-400">{room.lastActive}</span>
      </div>
    </button>
  );
};

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

const RoomPanel = ({ room, onBack }) => {
  const Icon = TYPE_ICON[room.type];
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Avery',  text: 'Welcome everyone! Share your latest tips.', time: '9:12 AM' },
    { id: 2, sender: 'Jordan', text: 'Just shipped a new React layout for a client.', time: '9:15 AM' },
  ]);
  const [text, setText] = useState('');

  const send = () => {
    const trimmed = text.trim();
    if (!trimmed || room.type !== 'text') return;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'You', text: trimmed, time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) }]);
    setText('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          {onBack && (
            <button onClick={onBack} className="md:hidden p-1.5 -ml-2 mr-1 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
              <ArrowLeft size={18} />
            </button>
          )}
          <Icon size={16} className="text-gray-400 flex-shrink-0" />
          <h2 className="font-bold text-gray-900 text-base md:text-lg truncate">{room.name}</h2>
          <span className="text-xs px-2 py-0.5 rounded-full border border-gray-200 text-gray-500 ml-1 whitespace-nowrap hidden sm:inline-block">{TYPE_LABEL[room.type]}</span>
        </div>
        <p className="text-sm text-gray-400 mt-1 line-clamp-1">{room.description}</p>
        <span className="flex items-center gap-1 text-xs text-gray-400 mt-1"><Users size={12} /> {room.members} members</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-3">
        {room.type === 'text' ? messages.map(m => (
          <div key={m.id} className={`flex gap-3 ${m.sender === 'You' ? 'flex-row-reverse' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-500">
              {m.sender[0]}
            </div>
            <div className={`max-w-xs ${m.sender === 'You' ? 'items-end' : ''} flex flex-col`}>
              <span className="text-xs text-gray-400 mb-1">{m.sender} · {m.time}</span>
              <div className={`px-3 py-2 rounded-xl text-sm ${m.sender === 'You' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
                {m.text}
              </div>
            </div>
          </div>
        )) : (
          <div className="flex items-center justify-center h-full text-sm text-gray-400">
            This is a {room.type} room — connect via backend to start.
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-3 md:px-4 py-3 border-t border-gray-200">
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 md:px-4 py-2">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
            placeholder={room.type === 'text' ? `Message #${room.name}...` : 'Voice/Video rooms require backend connection'}
            disabled={room.type !== 'text'}
          />
          {room.type === 'text' && (
            <button
              onClick={send}
              disabled={!text.trim()}
              className="p-1.5 bg-gray-900 text-white hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-gray-900"
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

const CreateModal = ({ onClose }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('text');
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Create a Room</h2>
        <label className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Study Together"
          className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-gray-900 mb-4" />
        <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
        <div className="flex gap-2 mb-6">
          {['text','voice','video'].map(t => (
            <button key={t} onClick={() => setType(t)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all
                ${type === t ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
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

/* ─── Main Page ─────────────────────────────────────────────── */
export default function ChatRoomsPage() {
  const [search,    setSearch]    = useState('');
  const [filter,    setFilter]    = useState('all');
  const [selected,  setSelected]  = useState(null);
  const [showModal, setShowModal] = useState(false);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return ROOMS.filter(r =>
      (filter === 'all' || r.type === filter) &&
      (!term || r.name.toLowerCase().includes(term) || r.description.toLowerCase().includes(term))
    );
  }, [search, filter]);

  return (
    <div className="app-page flex flex-col">
      <AppNavbar />

      {/* Search + Create bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2 max-w-sm w-full bg-gray-100 rounded-xl px-3 py-2">
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search chat rooms..."
              className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full min-w-0" />
          </div>
          <div className="flex-1" />
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 md:px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 transition-colors whitespace-nowrap flex-shrink-0">
            <Plus size={15} /> <span className="hidden sm:inline">Create Room</span>
          </button>
        </div>
      </div>

      {/* Two-column body */}
      <div className="flex-1 flex flex-col md:flex-row max-w-6xl w-full mx-auto px-4 py-4 gap-4" style={{ minHeight: 0 }}>

        {/* LEFT sidebar */}
        <aside className={`w-full md:w-72 flex-shrink-0 flex-col ${selected ? 'hidden md:flex' : 'flex'}`}>
          <div className="mb-3">
            <h2 className="font-bold text-gray-900 text-base">Chat Rooms</h2>
            <p className="text-xs text-gray-400">{visible.length} rooms available</p>
          </div>

          {/* Filter pills */}
          <div className="flex items-center bg-gray-100/80 p-1 rounded-xl mb-4 w-full">
            {FILTERS.map(({ key, label, Icon }) => (
              <button key={key} onClick={() => setFilter(key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-1 sm:px-2 rounded-lg text-[13px] font-medium transition-all duration-200 ease-out group
                  ${filter === key 
                    ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5 scale-[1.02]' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/60'}`}
              >
                {Icon && (
                  <Icon 
                    size={14} 
                    className={`transition-colors duration-200 ${filter === key ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}`} 
                  />
                )}
                <span className="truncate">{label}</span>
              </button>
            ))}
          </div>

          {/* Room list */}
          <div className="flex-1 overflow-y-auto pr-1">
            {visible.length === 0
              ? <p className="text-sm text-gray-400 text-center mt-8">No rooms found.</p>
              : visible.map(r => (
                  <RoomCard key={r.id} room={r} isSelected={selected?.id === r.id} onSelect={setSelected} />
                ))}
          </div>
        </aside>

        {/* Divider */}
        <div className="hidden md:block w-px bg-gray-200 flex-shrink-0" />

        {/* RIGHT panel */}
        <main className={`flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex-col ${!selected ? 'hidden md:flex' : 'flex'}`} style={{ minHeight: '500px' }}>
          {selected ? <RoomPanel key={selected.id} room={selected} onBack={() => setSelected(null)} /> : <EmptyState />}
        </main>
      </div>

      {showModal && <CreateModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
