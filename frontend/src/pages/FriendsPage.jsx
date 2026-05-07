import React, { useMemo, useState } from "react";
import AppNavbar from "../components/common/AppNavbar";
import SuggestedFriends from "../components/friends/SuggestedFriends";
import FriendSearch from "../components/friends/FriendSearch";
import MessageList from "../components/friends/MessageList";
import FriendChatPanel from "../components/friends/FriendChatPanel";
import FriendEmptyState from "../components/friends/FriendEmptyState";

const SUGGESTED_FRIENDS = [
  {
    id: 1,
    name: "Jessica Lee",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "David Park",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Lisa Wang",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
  },
];

const MESSAGE_FRIENDS = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    lastMessage: "See you tomorrow!",
    online: true,
    unread: 2,
  },
  {
    id: 2,
    name: "Mike Chen",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    lastMessage: "Thanks for the help",
    online: true,
    unread: 0,
  },
  {
    id: 3,
    name: "Emma Davis",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
    lastMessage: "That sounds great!",
    online: false,
    unread: 0,
  },
];

const INITIAL_MESSAGES = {
  1: [
    {
      id: 1,
      sender: "Sarah Johnson",
      text: "See you tomorrow!",
      time: "9:32 AM",
    },
    { id: 2, sender: "You", text: "Sounds good, talk soon.", time: "9:33 AM" },
  ],
  2: [
    {
      id: 1,
      sender: "Mike Chen",
      text: "Thanks for the help",
      time: "10:05 AM",
    },
  ],
  3: [
    {
      id: 1,
      sender: "Emma Davis",
      text: "That sounds great!",
      time: "Yesterday",
    },
  ],
};

const FriendsPage = () => {
  const [addedFriendIds, setAddedFriendIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [messagesByFriendId, setMessagesByFriendId] =
    useState(INITIAL_MESSAGES);

  const normalizedSearch = appliedSearch.trim().toLowerCase();

  const filteredSuggested = useMemo(() => {
    if (!normalizedSearch) return SUGGESTED_FRIENDS;
    return SUGGESTED_FRIENDS.filter((friend) =>
      friend.name.toLowerCase().includes(normalizedSearch),
    );
  }, [normalizedSearch]);

  const filteredMessageFriends = useMemo(() => {
    if (!normalizedSearch) return MESSAGE_FRIENDS;
    return MESSAGE_FRIENDS.filter((friend) =>
      friend.name.toLowerCase().includes(normalizedSearch),
    );
  }, [normalizedSearch]);

  const handleAddFriend = (friendId) => {
    if (addedFriendIds.includes(friendId)) return;
    setAddedFriendIds((prev) => [...prev, friendId]);
  };

  const handleSearch = () => {
    setAppliedSearch(searchTerm);
  };

  const handleSendMessage = () => {
    if (!selectedFriend) return;
    const trimmed = messageInput.trim();
    if (!trimmed) return;

    setMessagesByFriendId((prev) => {
      const existing = prev[selectedFriend.id] || [];
      const time = new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });
      return {
        ...prev,
        [selectedFriend.id]: [
          ...existing,
          { id: Date.now(), sender: "You", text: trimmed, time },
        ],
      };
    });
    setMessageInput("");
  };

  const selectedMessages = selectedFriend
    ? messagesByFriendId[selectedFriend.id] || []
    : [];

  return (
    <div className="app-page flex flex-col">
      <AppNavbar />

      <div className="max-w-6xl w-full mx-auto px-4 py-6 space-y-6">
        <SuggestedFriends
          friends={filteredSuggested}
          addedFriendIds={addedFriendIds}
          onAdd={handleAddFriend}
        />

        <FriendSearch
          value={searchTerm}
          onChange={setSearchTerm}
          onSearch={handleSearch}
        />
        {normalizedSearch && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Showing results for "{appliedSearch}"
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-[minmax(320px,420px)_minmax(0,1fr)] gap-4">
          <MessageList
            friends={filteredMessageFriends}
            selectedFriendId={selectedFriend?.id}
            onSelect={setSelectedFriend}
          />

          <div className="min-h-[360px]">
            {selectedFriend ? (
              <FriendChatPanel
                friend={selectedFriend}
                messages={selectedMessages}
                messageInput={messageInput}
                onMessageChange={setMessageInput}
                onSend={handleSendMessage}
              />
            ) : (
              <FriendEmptyState />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
