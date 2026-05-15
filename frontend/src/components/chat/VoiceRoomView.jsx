import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRoomContext } from "@livekit/components-react";
import { ConnectionState, RoomEvent, Track } from "livekit-client";
import { Loader2, LogOut, Mic, MicOff, Users, Wifi, WifiOff } from "lucide-react";
import LiveKitRoomWrapper from "./LiveKitRoomWrapper";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs) => twMerge(clsx(inputs));

function readDefaultDisplayName() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return "";
    const user = JSON.parse(raw);
    return user?.fullName || user?.username || user?.email || "";
  } catch {
    return "";
  }
}

function buildVoiceParticipants(room) {
  if (!room) return [];
  const active = new Set((room.activeSpeakers || []).map((p) => p.identity));
  const result = [];

  const push = (participant, isLocal) => {
    const audioPub = participant.getTrackPublication(Track.Source.Microphone);
    result.push({
      id: participant.identity,
      name: participant.name || participant.identity || "Unknown",
      isLocal,
      isMuted: audioPub?.isMuted ?? true,
      isSpeaking: active.has(participant.identity),
    });
  };

  if (room.localParticipant) {
    push(room.localParticipant, true);
  }
  room.remoteParticipants.forEach((p) => push(p, false));
  return result;
}

function VoiceRoomContent({ room, onLeave }) {
  const livekitRoom = useRoomContext();
  const [participants, setParticipants] = useState([]);
  const [connectionState, setConnectionState] = useState(
    ConnectionState.Disconnected,
  );
  const [micEnabled, setMicEnabled] = useState(false);

  const syncParticipants = useCallback(() => {
    if (!livekitRoom) return;
    setParticipants(buildVoiceParticipants(livekitRoom));
    setMicEnabled(Boolean(livekitRoom.localParticipant?.isMicrophoneEnabled));
  }, [livekitRoom]);

  useEffect(() => {
    if (!livekitRoom) return undefined;

    const update = () => syncParticipants();
    const handleConnected = () => {
      console.log("[LiveKit] Connected to voice room");
    };
    const handleDisconnected = () => {
      console.log("[LiveKit] Disconnected from voice room");
    };
    const handleParticipantConnected = (participant) => {
      console.log("[LiveKit] Participant joined:", participant.identity);
      update();
    };
    const handleParticipantDisconnected = (participant) => {
      console.log("[LiveKit] Participant left:", participant.identity);
      update();
    };

    livekitRoom.on(RoomEvent.Connected, handleConnected);
    livekitRoom.on(RoomEvent.Disconnected, handleDisconnected);
    livekitRoom.on(RoomEvent.ParticipantConnected, handleParticipantConnected);
    livekitRoom.on(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
    livekitRoom.on(RoomEvent.ActiveSpeakersChanged, update);
    livekitRoom.on(RoomEvent.TrackMuted, update);
    livekitRoom.on(RoomEvent.TrackUnmuted, update);
    livekitRoom.on(RoomEvent.LocalTrackPublished, update);
    livekitRoom.on(RoomEvent.LocalTrackUnpublished, update);

    update();

    return () => {
      livekitRoom.off(RoomEvent.Connected, handleConnected);
      livekitRoom.off(RoomEvent.Disconnected, handleDisconnected);
      livekitRoom.off(RoomEvent.ParticipantConnected, handleParticipantConnected);
      livekitRoom.off(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
      livekitRoom.off(RoomEvent.ActiveSpeakersChanged, update);
      livekitRoom.off(RoomEvent.TrackMuted, update);
      livekitRoom.off(RoomEvent.TrackUnmuted, update);
      livekitRoom.off(RoomEvent.LocalTrackPublished, update);
      livekitRoom.off(RoomEvent.LocalTrackUnpublished, update);
    };
  }, [livekitRoom, syncParticipants]);

  useEffect(() => {
    if (!livekitRoom) return undefined;
    const handleState = (state) => {
      setConnectionState(state);
    };
    livekitRoom.on(RoomEvent.ConnectionStateChanged, handleState);
    setConnectionState(livekitRoom.connectionState);
    return () => {
      livekitRoom.off(RoomEvent.ConnectionStateChanged, handleState);
    };
  }, [livekitRoom]);

  useEffect(() => {
    if (!livekitRoom || connectionState !== ConnectionState.Connected) return;
    livekitRoom.localParticipant
      .setCameraEnabled(false)
      .catch(() => null);
    livekitRoom.localParticipant
      .setMicrophoneEnabled(true)
      .catch(() => null);
  }, [livekitRoom, connectionState]);

  const handleToggleMic = async () => {
    if (!livekitRoom?.localParticipant) return;
    try {
      const next = !micEnabled;
      await livekitRoom.localParticipant.setMicrophoneEnabled(next);
      setMicEnabled(next);
      syncParticipants();
    } catch (err) {
      console.error("[LiveKit] Toggle mic failed:", err);
    }
  };

  const stopLocalTracks = useCallback(() => {
    const participant = livekitRoom?.localParticipant;
    if (!participant?.trackPublications) return;
    participant.trackPublications.forEach((publication) => {
      if (!publication?.track) return;
      try {
        participant.unpublishTrack(publication.track);
      } catch (_) {}
      try {
        publication.track.stop();
      } catch (_) {}
    });
  }, [livekitRoom]);

  const handleLeave = async () => {
    if (livekitRoom) {
      try {
        await livekitRoom.localParticipant?.setMicrophoneEnabled(false);
      } catch (_) {}
      try {
        await livekitRoom.localParticipant?.setCameraEnabled(false);
      } catch (_) {}
      stopLocalTracks();
      try {
        await livekitRoom.disconnect();
      } catch (_) {}
    }
    onLeave?.();
  };

  const isConnecting =
    connectionState === ConnectionState.Connecting ||
    connectionState === ConnectionState.Reconnecting;
  const isConnected = connectionState === ConnectionState.Connected;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black">
      <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-200 dark:border-neutral-800">
        <div>
          <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100">
            {room.name}
          </h2>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            {isConnected ? (
              <>
                <Wifi size={11} className="text-green-500" /> Connected
              </>
            ) : isConnecting ? (
              <>
                <Loader2 size={11} className="animate-spin text-yellow-500" />
                Connecting...
              </>
            ) : (
              <>
                <WifiOff size={11} className="text-red-400" /> Disconnected
              </>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={handleLeave}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-neutral-800 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
        >
          <LogOut size={16} /> Leave
        </button>
      </div>

      <div className="flex-1 p-4 md:p-6 overflow-auto">
        {participants.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <Users size={36} className="mb-3 opacity-50" />
            <p className="text-sm font-medium">
              {isConnected ? "Waiting for participants..." : "Not connected"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className={cn(
                  "rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 flex items-center gap-4 transition-all",
                  participant.isSpeaking && "ring-2 ring-green-500/70",
                )}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold",
                    participant.isSpeaking
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 dark:bg-neutral-800 text-gray-500",
                  )}
                >
                  {participant.name[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {participant.isLocal ? "You" : participant.name}
                    </span>
                    {participant.isMuted ? (
                      <MicOff size={14} className="text-red-400" />
                    ) : (
                      <Mic size={14} className="text-green-500" />
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    {participant.isSpeaking ? "Speaking" : "Silent"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 md:px-6 py-4 border-t border-gray-200 dark:border-neutral-800 bg-white dark:bg-black">
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={handleToggleMic}
            disabled={!isConnected}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed",
              micEnabled
                ? "bg-gray-900 dark:bg-white text-white dark:text-black hover:opacity-80"
                : "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40",
            )}
          >
            {micEnabled ? <Mic size={16} /> : <MicOff size={16} />}
            {micEnabled ? "Mute" : "Unmute"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VoiceRoomView({ room, onLeave }) {
  const displayName = useMemo(() => readDefaultDisplayName(), []);

  return (
    <LiveKitRoomWrapper room={room} roomType="VOICE" displayName={displayName}>
      <VoiceRoomContent room={room} onLeave={onLeave} />
    </LiveKitRoomWrapper>
  );
}
