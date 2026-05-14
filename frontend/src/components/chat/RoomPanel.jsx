import React, { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {
  MessageSquare,
  Mic,
  Video,
  Users,
  ArrowLeft,
  Send,
} from "lucide-react";
import VoiceRoom from "./VoiceRoom";
import { joinRoomApi } from "../../services/roomsApi";

const API_BASE = "http://localhost:8080";

const TYPE_ICON = { text: MessageSquare, voice: Mic, video: Video };
const TYPE_LABEL = {
  text: "Text Chat",
  voice: "Voice Chat",
  video: "Video Chat",
};

export default function RoomPanel({ room, onBack }) {
  const Icon = TYPE_ICON[room.type] || MessageSquare;
  const [isJoined, setIsJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const stompRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await joinRoomApi(room.id);
      } catch (e) {
        console.error(e);
      }
      if (cancelled) return;
    })();
    return () => {
      cancelled = true;
    };
  }, [room.id]);

  useEffect(() => {
    if (room.type !== "text") return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const client = new Client({
      webSocketFactory: () =>
        new SockJS(`${API_BASE}/ws?token=${encodeURIComponent(token)}`),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/room.${room.id}`, (message) => {
          try {
            const body = JSON.parse(message.body || "{}");
            if (body.event === "CHAT_MESSAGE" && body.payload) {
              const p = body.payload;
              setMessages((prev) => [
                ...prev,
                {
                  id: `${p.timestamp}-${p.senderId}`,
                  sender: p.senderName || "User",
                  text: p.content,
                  time: new Date(p.timestamp).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  }),
                },
              ]);
            }
          } catch (err) {
            console.warn(err);
          }
        });
      },
    });

    stompRef.current = client;
    client.activate();

    return () => {
      stompRef.current = null;
      client.deactivate();
    };
  }, [room.id, room.type]);

  const send = () => {
    const trimmed = text.trim();
    if (!trimmed || room.type !== "text") return;
    const client = stompRef.current;
    if (!client?.connected) return;
    client.publish({
      destination: "/app/room.chat.send",
      body: JSON.stringify({ roomId: room.id, content: trimmed }),
    });
    setText("");
  };

  if (isJoined && room.type === "video") {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <Video size={48} className="text-gray-300 mb-4" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Video rooms
        </h2>
        <p className="text-sm text-gray-500 mb-6 max-w-sm">
          Video stage rooms are not wired up yet. Use a voice room for LiveKit
          audio today.
        </p>
        <button
          type="button"
          onClick={() => setIsJoined(false)}
          className="px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-semibold"
        >
          Back
        </button>
      </div>
    );
  }

  if (isJoined && room.type === "voice") {
    return <VoiceRoom room={room} onLeave={() => setIsJoined(false)} />;
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#050505] transition-colors duration-500">
      <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-black transition-colors duration-500">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              type="button"
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
            {TYPE_LABEL[room.type] || "Room"}
          </span>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 line-clamp-1">
          {room.description}
        </p>
        <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mt-1">
          <Users size={12} /> {room.members} members
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-3">
        {room.type === "text" ? (
          messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 text-sm py-12">
              No messages yet. Say hello below.
            </div>
          ) : (
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
          )
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
                ? "Join to listen on stage, use text chat, and request the microphone. Only hosts, admins, and approved speakers publish audio to LiveKit."
                : "Video channels are coming soon."}
            </p>
            <button
              type="button"
              onClick={() => setIsJoined(true)}
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm bg-gray-900 dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 ring-gray-900/20 hover:ring-4"
            >
              <Icon size={18} strokeWidth={2} />
              Join {room.type === "voice" ? "Voice" : "Video"} Room
            </button>
          </div>
        )}
      </div>

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
                : "Text messaging is unavailable until you join the channel"
            }
            disabled={room.type !== "text"}
          />
          {room.type === "text" && (
            <button
              type="button"
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
}
