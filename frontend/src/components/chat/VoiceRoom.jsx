import React, { useCallback, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { Room, RoomEvent } from "livekit-client";
import StageArea from "./StageArea";
import RoomChat from "./RoomChat";
import { X, Shield, Mic } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { fetchLiveKitToken, fetchRoomState, joinRoomApi } from "../../services/roomsApi";

const twMergeCls = (...inputs) => twMerge(clsx(inputs));
const API_BASE = "http://localhost:8080";

function readLocalUserId() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const u = JSON.parse(raw);
    return u?._id || u?.id || null;
  } catch {
    return null;
  }
}

function mapMemberToTile(m) {
  const r = (m.role || "").toString();
  const role =
    r === "SPEAKER" ? "speaker" : r === "HOST" ? "host" : r === "ADMIN" ? "admin" : "speaker";
  return {
    id: m.userId,
    name: m.displayName || m.userId,
    role,
    isMuted: true,
    isSpeaking: false,
    avatar: null,
  };
}

function AddToStageModal({ isOpen, onClose, onApprove, request }) {
  if (!isOpen || !request) return null;
  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-sm border border-gray-100 dark:border-neutral-800">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Add {request.name} to Stage
            </h2>
            <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800">
              <X size={20} className="text-gray-400" />
            </button>
          </div>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => onApprove(request.id, "SPEAKER")}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-gray-500">
                <Mic size={20} />
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-gray-100">Speaker</div>
                <div className="text-xs text-gray-400">Can publish microphone</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => onApprove(request.id, "ADMIN")}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                <Shield size={20} />
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-gray-100">Admin</div>
                <div className="text-xs text-gray-400">Can speak and manage requests</div>
              </div>
            </button>
          </div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-neutral-800/50">
          <button type="button" onClick={onClose} className="w-full py-3 text-sm font-bold text-gray-500">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VoiceRoom({ room, onLeave }) {
  const localParticipantId = readLocalUserId();
  const [participants, setParticipants] = useState([]);
  const [audience, setAudience] = useState([]);
  const [messages, setMessages] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState("audience");
  const stompRef = useRef(null);
  const lkRoomRef = useRef(null);

  const applyStatePayload = useCallback(
    (payload) => {
      if (!payload) return;
      setParticipants((payload.stage || []).map(mapMemberToTile));
      setAudience(payload.audience || []);
      setRequests(
        (payload.pendingRequests || []).map((r) => ({
          id: r.id,
          name: r.displayName || r.userId,
          userId: r.userId,
          avatar: null,
        })),
      );
      const self = [...(payload.stage || []), ...(payload.audience || [])].find(
        (m) => m.userId === localParticipantId,
      );
      if (self) {
        const rr = (self.role || "").toString();
        setCurrentUserRole(
          rr === "HOST" ? "host" : rr === "ADMIN" ? "admin" : rr === "SPEAKER" ? "speaker" : "audience",
        );
      }
    },
    [localParticipantId],
  );

  const connectLiveKit = useCallback(async () => {
    const prev = lkRoomRef.current;
    if (prev) {
      prev.removeAllListeners();
      await prev.disconnect();
      lkRoomRef.current = null;
    }
    const cred = await fetchLiveKitToken(room.id);
    const r = new Room();
    lkRoomRef.current = r;
    await r.connect(cred.serverUrl, cred.token, { autoSubscribe: true });

    const syncMic = () => {
      const lp = r.localParticipant;
      const enabled = lp?.isMicrophoneEnabled ?? false;
      setParticipants((prev) =>
        prev.map((p) => (p.id === localParticipantId ? { ...p, isMuted: !enabled } : p)),
      );
    };

    r.on(RoomEvent.LocalTrackPublished, syncMic);
    r.on(RoomEvent.LocalTrackUnpublished, syncMic);
    r.on(RoomEvent.ActiveSpeakersChanged, () => {
      const ids = new Set((r.activeSpeakers || []).map((s) => s.identity));
      setParticipants((prev) => prev.map((p) => ({ ...p, isSpeaking: ids.has(p.id) })));
    });
    syncMic();
  }, [room.id, localParticipantId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await joinRoomApi(room.id);
        const state = await fetchRoomState(room.id);
        if (!cancelled) applyStatePayload(state);
        await connectLiveKit();
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [room.id, applyStatePayload, connectLiveKit]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !room?.id) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(`${API_BASE}/ws?token=${encodeURIComponent(token)}`),
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
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  avatar: null,
                },
              ]);
            } else if (body.event === "ROOM_STATE" && body.payload?.state) {
              applyStatePayload(body.payload.state);
              const affected = body.payload.affectedUserIds || [];
              if (localParticipantId && affected.includes(localParticipantId)) {
                setIsRequestPending(false);
                connectLiveKit().catch(console.error);
              }
            }
          } catch (err) {
            console.warn(err);
          }
        });

        client.subscribe("/user/queue/room", (message) => {
          try {
            const body = JSON.parse(message.body || "{}");
            if (body.event === "LIVEKIT_REFRESH") {
              connectLiveKit().catch(console.error);
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
      const lk = lkRoomRef.current;
      if (lk) {
        lk.removeAllListeners();
        lk.disconnect();
        lkRoomRef.current = null;
      }
    };
  }, [room.id, applyStatePayload, connectLiveKit, localParticipantId]);

  const stomp = () => stompRef.current;

  const handleSendMessage = (t) => {
    stomp()?.publish({
      destination: "/app/room.chat.send",
      body: JSON.stringify({ roomId: room.id, content: t }),
    });
  };

  const handleRequestStage = () => {
    stomp()?.publish({
      destination: "/app/room.voice.raiseHand",
      body: JSON.stringify({ roomId: room.id }),
    });
    setIsRequestPending(true);
  };

  const handleMuteToggle = async (muted) => {
    const lk = lkRoomRef.current;
    if (!lk) return;
    const self = participants.find((p) => p.id === localParticipantId);
    if (!self) return;
    try {
      await lk.localParticipant.setMicrophoneEnabled(!muted);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveFromStage = (targetId) => {
    stomp()?.publish({
      destination: "/app/room.voice.removeFromStage",
      body: JSON.stringify({ roomId: room.id, targetUserId: targetId }),
    });
  };

  const handleApproveRequest = (requestId, promoteRole) => {
    stomp()?.publish({
      destination: "/app/room.voice.decideStage",
      body: JSON.stringify({
        roomId: room.id,
        requestId,
        approve: true,
        promoteRole,
      }),
    });
    setSelectedRequest(null);
  };

  const isOnStage = participants.some((p) => p.id === localParticipantId);
  const localParticipant = participants.find((p) => p.id === localParticipantId);

  return (
    <div className="relative flex flex-col h-full overflow-hidden bg-white dark:bg-black">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-neutral-800 shrink-0">
        <div className="min-w-0">
          <div className="text-xs text-gray-400">Voice</div>
          <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">{room.name}</div>
        </div>
        <button
          type="button"
          onClick={() => onLeave?.()}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-gray-200"
        >
          Leave
        </button>
      </div>

      <div className="flex-[1.2] min-h-0">
        <StageArea
          participants={participants}
          localParticipantId={localParticipantId}
          onMuteToggle={handleMuteToggle}
          onRemoveFromStage={handleRemoveFromStage}
          requests={requests}
          onOpenRequests={() => setShowRequests(true)}
          currentUserRole={localParticipant?.role || currentUserRole}
        />
      </div>

      {audience.length > 0 && (
        <div className="shrink-0 border-y border-gray-100 dark:border-neutral-800 bg-gray-50/80 dark:bg-neutral-900/40 px-4 py-2">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">
            Audience ({audience.length})
          </div>
          <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
            {audience.map((a) => (
              <span
                key={a.userId}
                className="text-xs px-2 py-1 rounded-full bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-200"
              >
                {a.displayName || a.userId}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 min-h-0">
        <RoomChat
          messages={messages}
          onSendMessage={handleSendMessage}
          onRequestStage={handleRequestStage}
          isRequestPending={isRequestPending}
          isOnStage={isOnStage}
          roomName={room.name}
        />
      </div>

      {showRequests && (
        <div className="absolute inset-0 bg-black/20 z-50 flex justify-end">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 shadow-2xl">
            <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">Stage Requests</h3>
              <button type="button" onClick={() => setShowRequests(false)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {requests.length === 0 ? (
                <div className="py-20 text-center opacity-40">
                  <p>No pending requests.</p>
                </div>
              ) : (
                requests.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-neutral-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-700" />
                      <span className="font-bold text-sm text-gray-900 dark:text-gray-100">{req.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedRequest(req)}
                        className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl text-xs font-bold"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          stomp()?.publish({
                            destination: "/app/room.voice.decideStage",
                            body: JSON.stringify({
                              roomId: room.id,
                              requestId: req.id,
                              approve: false,
                            }),
                          })
                        }
                        className="p-2 text-gray-400 hover:text-red-500"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <AddToStageModal
        isOpen={!!selectedRequest}
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onApprove={handleApproveRequest}
      />
    </div>
  );
}
