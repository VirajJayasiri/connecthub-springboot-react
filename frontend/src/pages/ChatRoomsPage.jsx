import { useMemo, useState } from "react";
import SearchCreateBar from "../components/chat/SearchCreateBar.jsx";
import FilterTabs from "../components/chat/FilterTabs.jsx";
import RoomCard from "../components/chat/RoomCard.jsx";
import EmptyState from "../components/chat/EmptyState.jsx";
import RoomDetails from "../components/chat/RoomDetails.jsx";
import CreateRoomModal from "../components/chat/CreateRoomModal.jsx";
import "./ChatRoomsPage.css";

const initialRooms = [
  {
    id: 1,
    name: "Web Development",
    type: "text",
    description: "Discuss all things web dev - React, Vue, Angular, and more",
    members: 245,
    lastActive: "2 weeks ago",
    isPrivate: false,
  },
  {
    id: 2,
    name: "Photography Lovers",
    type: "text",
    description: "Share your best shots and photography tips",
    members: 189,
    lastActive: "1 month ago",
    isPrivate: false,
  },
  {
    id: 3,
    name: "Gaming Voice Chat",
    type: "voice",
    description: "Voice chat for gamers - drop in and chat while playing",
    members: 47,
    lastActive: "3 weeks ago",
    isPrivate: false,
  },
  {
    id: 4,
    name: "Music Jam Session",
    type: "voice",
    description: "Live music collaboration and jamming",
    members: 15,
    lastActive: "5 days ago",
    isPrivate: false,
  },
  {
    id: 5,
    name: "Study Together",
    type: "video",
    description: "Video study sessions - stay motivated while learning",
    members: 28,
    lastActive: "1 week ago",
    isPrivate: false,
  },
  {
    id: 6,
    name: "Team Standup",
    type: "video",
    description: "Daily team video standup meetings",
    members: 12,
    lastActive: "2 days ago",
    isPrivate: true,
  },
];

const initialMessages = {
  1: [
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
    {
      id: 3,
      sender: "Riley",
      text: "Remember to test mobile layouts early.",
      time: "9:20 AM",
    },
  ],
  2: [
    {
      id: 1,
      sender: "Avery",
      text: "Drop your favorite photo from this week.",
      time: "10:05 AM",
    },
  ],
};

function ChatRoomsPage() {
  const [rooms, setRooms] = useState(initialRooms);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [roomMessages, setRoomMessages] = useState(initialMessages);

  const filteredRooms = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return rooms.filter((room) => {
      const matchesFilter =
        selectedFilter === "all" || room.type === selectedFilter;
      const matchesSearch =
        !term ||
        room.name.toLowerCase().includes(term) ||
        room.description.toLowerCase().includes(term);
      return matchesFilter && matchesSearch;
    });
  }, [rooms, searchTerm, selectedFilter]);

  const handleCreateRoom = (newRoom) => {
    const room = {
      id: Date.now(),
      members: 1,
      lastActive: "just now",
      ...newRoom,
    };
    setRooms((prev) => [room, ...prev]);
    setSelectedRoom(room);
    setIsCreateModalOpen(false);
  };

  const handleJoinRoom = (room) => {
    setSelectedRoom(room);
    setMessageText("");
  };

  const handleSendMessage = () => {
    const trimmed = messageText.trim();
    if (!trimmed || !selectedRoom || selectedRoom.type !== "text") return;

    const newMessage = {
      id: Date.now(),
      sender: "You",
      text: trimmed,
      time: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    setRoomMessages((prev) => ({
      ...prev,
      [selectedRoom.id]: [...(prev[selectedRoom.id] || []), newMessage],
    }));

    setMessageText("");
  };

  return (
    <div className="chat-page">
      <SearchCreateBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateClick={() => setIsCreateModalOpen(true)}
      />

      <div className="chat-layout">
        <aside className="chat-sidebar">
          <div className="sidebar-header">
            <div>
              <h2>Chat Rooms</h2>
              <p className="room-count">
                {filteredRooms.length} rooms available
              </p>
            </div>
          </div>

          <FilterTabs
            selectedFilter={selectedFilter}
            onChange={setSelectedFilter}
          />

          <div className="room-list">
            {filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                selectedFilter={selectedFilter}
                isSelected={selectedRoom?.id === room.id}
                onJoinRoom={handleJoinRoom}
              />
            ))}
            {filteredRooms.length === 0 && (
              <div className="room-empty">No rooms match your filters.</div>
            )}
          </div>
        </aside>

        <section className="chat-main">
          {selectedRoom ? (
            <RoomDetails
              room={selectedRoom}
              messages={roomMessages[selectedRoom.id] || []}
              messageText={messageText}
              onMessageTextChange={setMessageText}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <EmptyState />
          )}
        </section>
      </div>

      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateRoom}
      />
    </div>
  );
}

export default ChatRoomsPage;
