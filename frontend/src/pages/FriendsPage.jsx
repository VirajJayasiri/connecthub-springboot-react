import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import AppNavbar from "../components/common/AppNavbar";
import SuggestedFriends from "../components/friends/SuggestedFriends";
import FriendSearch from "../components/friends/FriendSearch";
import MessageList from "../components/friends/MessageList";
import FriendChatPanel from "../components/friends/FriendChatPanel";
import FriendEmptyState from "../components/friends/FriendEmptyState";

const API_BASE = "http://localhost:8080";

const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};

const buildAvatar = (name, profileImage) => {
  if (profileImage) return profileImage;
  const safeName = encodeURIComponent(name || "User");
  return `https://ui-avatars.com/api/?name=${safeName}`;
};

const FriendsPage = () => {
  const navigate = useNavigate();
  const [addedFriendIds, setAddedFriendIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [messageFriends, setMessageFriends] = useState([]);
  const [messagesByFriendId, setMessagesByFriendId] = useState({});
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [suggestedLoading, setSuggestedLoading] = useState(true);
  const [suggestedError, setSuggestedError] = useState("");
  const [friendsLoading, setFriendsLoading] = useState(true);
  const [friendsError, setFriendsError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [wsConnected, setWsConnected] = useState(false);
  const totalUnread = useMemo(
    () => messageFriends.reduce((sum, friend) => sum + (friend.unread || 0), 0),
    [messageFriends],
  );

  useEffect(() => {
    localStorage.setItem("friendsUnreadCount", String(totalUnread));
    window.dispatchEvent(new Event("friends-unread-update"));
  }, [totalUnread]);

  const chatEndRef = useRef(null);
  const stompClientRef = useRef(null);
  const selectedFriendIdRef = useRef(null);
  const suggestedFriendsRef = useRef([]);

  const token = useMemo(() => localStorage.getItem("token"), []);
  const storedUser = useMemo(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (err) {
      return null;
    }
  }, []);
  const currentUserId = storedUser?._id || storedUser?.id || null;

  useEffect(() => {
    selectedFriendIdRef.current = selectedFriend?.id || null;
  }, [selectedFriend]);

  useEffect(() => {
    suggestedFriendsRef.current = suggestedFriends;
  }, [suggestedFriends]);

  const handleAuthError = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  }, [navigate]);

  const authHeaders = useMemo(() => {
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  }, [token]);

  const mapSuggestedUser = useCallback((user) => {
    const name = user.fullName || user.username || "User";
    return {
      id: user.id,
      name,
      avatar: buildAvatar(name, user.profileImage),
      online: Boolean(user.online),
    };
  }, []);

  const mapFriendSummary = useCallback((friend) => {
    const name = friend.fullName || friend.username || "User";
    return {
      id: friend.id,
      name,
      avatar: buildAvatar(name, friend.profileImage),
      online: Boolean(friend.online),
      lastMessage: friend.lastMessage || "Start a conversation",
      unread: friend.unreadCount || 0,
      username: friend.username || "",
    };
  }, []);

  const fetchSuggested = useCallback(async () => {
    if (!token) {
      handleAuthError();
      return;
    }

    setSuggestedLoading(true);
    setSuggestedError("");
    try {
      const response = await axios.get(`${API_BASE}/api/users/suggested`, {
        headers: authHeaders,
      });
      const users = Array.isArray(response.data) ? response.data : [];
      setSuggestedFriends(users.map(mapSuggestedUser));
    } catch (err) {
      if (err?.response?.status === 401) {
        handleAuthError();
        return;
      }
      setSuggestedError("Unable to load suggestions right now.");
    } finally {
      setSuggestedLoading(false);
    }
  }, [authHeaders, handleAuthError, mapSuggestedUser, token]);

  const fetchFriends = useCallback(async () => {
    if (!token) {
      handleAuthError();
      return;
    }

    setFriendsLoading(true);
    setFriendsError("");
    try {
      const response = await axios.get(`${API_BASE}/api/friends`, {
        headers: authHeaders,
      });
      const friends = Array.isArray(response.data) ? response.data : [];
      const mapped = friends.map(mapFriendSummary);
      setMessageFriends(mapped);
      setAddedFriendIds(mapped.map((friend) => friend.id));
    } catch (err) {
      if (err?.response?.status === 401) {
        handleAuthError();
        return;
      }
      setFriendsError("Unable to load your friends list.");
    } finally {
      setFriendsLoading(false);
    }
  }, [authHeaders, handleAuthError, mapFriendSummary, token]);

  useEffect(() => {
    fetchSuggested();
    fetchFriends();
  }, [fetchSuggested, fetchFriends]);

  useEffect(() => {
    if (!token || !currentUserId) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(`${API_BASE}/ws?token=${token}`),
      reconnectDelay: 5000,
      onConnect: () => {
        setWsConnected(true);
        setMessageError("");
        client.subscribe("/user/queue/messages", (message) => {
          const payload = JSON.parse(message.body || "{}");
          const otherId =
            payload.senderId === currentUserId
              ? payload.receiverId
              : payload.senderId;

          setMessagesByFriendId((prev) => {
            const existing = prev[otherId] || [];
            const next = [...existing, payload];
            return { ...prev, [otherId]: next };
          });

          setMessageFriends((prev) => {
            const index = prev.findIndex((friend) => friend.id === otherId);
            if (index >= 0) {
              const friend = prev[index];
              const isSelected =
                selectedFriendIdRef.current &&
                selectedFriendIdRef.current === otherId;
              const unread =
                payload.senderId === currentUserId
                  ? 0
                  : isSelected
                    ? 0
                    : (friend.unread || 0) + 1;
              const updatedFriend = {
                ...friend,
                lastMessage: payload.content,
                unread,
              };
              return [
                updatedFriend,
                ...prev.slice(0, index),
                ...prev.slice(index + 1),
              ];
            }

            const suggested = suggestedFriendsRef.current.find(
              (friend) => friend.id === otherId,
            );

            if (!suggested) return prev;

            return [
              {
                ...suggested,
                lastMessage: payload.content,
                unread: payload.senderId === currentUserId ? 0 : 1,
              },
              ...prev,
            ];
          });
        });

        client.subscribe("/topic/status", (message) => {
          const payload = JSON.parse(message.body || "{}");
          if (!payload.userId) return;

          setSuggestedFriends((prev) =>
            prev.map((friend) =>
              friend.id === payload.userId
                ? { ...friend, online: payload.online }
                : friend,
            ),
          );

          setMessageFriends((prev) =>
            prev.map((friend) =>
              friend.id === payload.userId
                ? { ...friend, online: payload.online }
                : friend,
            ),
          );

          setSelectedFriend((prev) =>
            prev && prev.id === payload.userId
              ? { ...prev, online: payload.online }
              : prev,
          );
        });
      },
      onDisconnect: () => {
        setWsConnected(false);
      },
      onStompError: () => {
        setMessageError("Real-time connection error. Reconnecting...");
      },
      onWebSocketClose: () => {
        setWsConnected(false);
      },
    });

    stompClientRef.current = client;
    client.activate();

    return () => {
      stompClientRef.current = null;
      client.deactivate();
    };
  }, [currentUserId, token]);

  const loadMessages = useCallback(
    async (friendId) => {
      if (!token) {
        handleAuthError();
        return;
      }

      setMessageError("");
      try {
        const response = await axios.get(
          `${API_BASE}/api/messages/${friendId}`,
          { headers: authHeaders },
        );
        const messages = Array.isArray(response.data) ? response.data : [];
        setMessagesByFriendId((prev) => ({
          ...prev,
          [friendId]: messages,
        }));
        setMessageFriends((prev) =>
          prev.map((friend) =>
            friend.id === friendId ? { ...friend, unread: 0 } : friend,
          ),
        );
      } catch (err) {
        if (err?.response?.status === 401) {
          handleAuthError();
          return;
        }
        setMessageError("Unable to load messages right now.");
      }
    },
    [authHeaders, handleAuthError, token],
  );

  useEffect(() => {
    if (!selectedFriend?.id) return;
    loadMessages(selectedFriend.id);
  }, [loadMessages, selectedFriend]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesByFriendId, selectedFriend]);

  const normalizedSearch = appliedSearch.trim().toLowerCase();

  const filteredSuggested = useMemo(() => {
    if (!normalizedSearch) return suggestedFriends;
    return suggestedFriends.filter((friend) =>
      friend.name.toLowerCase().includes(normalizedSearch),
    );
  }, [normalizedSearch, suggestedFriends]);

  const filteredMessageFriends = useMemo(() => {
    if (!normalizedSearch) return messageFriends;
    return messageFriends.filter((friend) =>
      friend.name.toLowerCase().includes(normalizedSearch),
    );
  }, [messageFriends, normalizedSearch]);

  const handleAddFriend = async (friendId) => {
    if (addedFriendIds.includes(friendId)) return;
    if (!token) {
      handleAuthError();
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE}/api/friends/add/${friendId}`,
        {},
        { headers: authHeaders },
      );
      const friend = response.data?.friend || null;
      const mappedFriend = friend ? mapFriendSummary(friend) : null;

      setAddedFriendIds((prev) => [...prev, friendId]);

      if (mappedFriend) {
        setMessageFriends((prev) => {
          if (prev.some((item) => item.id === friendId)) return prev;
          return [
            {
              ...mappedFriend,
              lastMessage: mappedFriend.lastMessage || "Start a conversation",
              unread: 0,
            },
            ...prev,
          ];
        });
        setSelectedFriend(mappedFriend);
      } else {
        fetchFriends();
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        handleAuthError();
        return;
      }
      setSuggestedError("Unable to add friend right now.");
    }
  };

  const handleSearch = () => {
    setAppliedSearch(searchTerm);
  };

  const handleSendMessage = () => {
    if (!selectedFriend) return;
    const trimmed = messageInput.trim();
    if (!trimmed) return;

    const client = stompClientRef.current;
    if (!client || !client.connected) {
      setMessageError("Real-time connection is unavailable.");
      return;
    }

    client.publish({
      destination: "/app/chat.send",
      body: JSON.stringify({
        receiverId: selectedFriend.id,
        content: trimmed,
      }),
    });

    setMessageFriends((prev) => {
      const index = prev.findIndex((friend) => friend.id === selectedFriend.id);
      if (index < 0) return prev;
      const updatedFriend = {
        ...prev[index],
        lastMessage: trimmed,
        unread: 0,
      };
      return [updatedFriend, ...prev.slice(0, index), ...prev.slice(index + 1)];
    });

    setMessageInput("");
  };

  const selectedMessages = useMemo(() => {
    if (!selectedFriend) return [];
    const rawMessages = messagesByFriendId[selectedFriend.id] || [];
    return rawMessages.map((message) => {
      const isSender = message.senderId === currentUserId;
      return {
        id: message.id || `${message.senderId}-${message.timestamp}`,
        sender: isSender ? "You" : selectedFriend.name,
        text: message.content,
        time: formatTime(message.timestamp),
      };
    });
  }, [currentUserId, messagesByFriendId, selectedFriend]);

  return (
    <div className="app-page flex flex-col">
      <AppNavbar friendsUnreadCount={totalUnread} />

      <div className="max-w-6xl w-full mx-auto px-4 py-6 space-y-6">
        <SuggestedFriends
          friends={filteredSuggested}
          addedFriendIds={addedFriendIds}
          onAdd={handleAddFriend}
          loading={suggestedLoading}
          error={suggestedError}
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

        {friendsError && (
          <p className="text-sm text-rose-500">{friendsError}</p>
        )}

        {messageError && (
          <p className="text-sm text-rose-500">{messageError}</p>
        )}

        {token && !wsConnected && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Reconnecting to chat...
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-[minmax(320px,420px)_minmax(0,1fr)] gap-4">
          <MessageList
            friends={filteredMessageFriends}
            selectedFriendId={selectedFriend?.id}
            onSelect={setSelectedFriend}
          />

          <div className="min-h-[360px]">
            {friendsLoading ? (
              <div className="h-full min-h-[320px] flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-neutral-800 rounded-2xl">
                Loading conversations...
              </div>
            ) : selectedFriend ? (
              <FriendChatPanel
                friend={selectedFriend}
                messages={selectedMessages}
                messageInput={messageInput}
                onMessageChange={setMessageInput}
                onSend={handleSendMessage}
                scrollAnchorRef={chatEndRef}
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
