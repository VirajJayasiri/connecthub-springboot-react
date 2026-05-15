import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRoomContext } from "@livekit/components-react";
import { ConnectionState, RoomEvent, Track } from "livekit-client";
import {
  Camera,
  CameraOff,
  Loader2,
  LogOut,
  Mic,
  MicOff,
  User,
  Wifi,
  WifiOff,
} from "lucide-react";
import LiveKitRoomWrapper from "./LiveKitRoomWrapper";

const MAX_NAME_LENGTH = 40;

function readDefaultDisplayName() {
  try {
    const stored = localStorage.getItem("videoDisplayName");
    if (stored) return stored;
    const raw = localStorage.getItem("user");
    if (!raw) return "";
    const u = JSON.parse(raw);
    return u?.fullName || u?.username || u?.email || "";
  } catch {
    return "";
  }
}

function normalizeDisplayName(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  return trimmed.slice(0, MAX_NAME_LENGTH);
}

function DisplayNamePrompt({ initialName, onSubmit, onCancel }) {
  const [name, setName] = useState(initialName || "");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const normalized = normalizeDisplayName(name);
    if (!normalized) {
      setError("Display name is required.");
      return;
    }
    onSubmit(normalized);
  };

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-2xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-gray-500">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Enter your name
              </h2>
              <p className="text-xs text-gray-500">
                This shows to other participants.
              </p>
            </div>
          </div>
          <input
            autoFocus
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Your display name"
            className="w-full px-4 py-3 rounded-2xl border border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 text-sm outline-none focus:ring-2 ring-gray-900/5 transition-all"
          />
          {error && (
            <p className="mt-2 text-xs font-semibold text-red-500">{error}</p>
          )}
        </div>
        <div className="p-4 pt-0 flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-neutral-800 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-semibold hover:opacity-90"
          >
            Join Video
          </button>
        </div>
      </div>
    </div>
  );
}

function VideoTile({ tile }) {
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !tile.videoTrack) return undefined;
    tile.videoTrack.attach(el);
    return () => {
      try {
        tile.videoTrack.detach(el);
      } catch (_) {}
    };
  }, [tile.videoTrack]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !tile.audioTrack || tile.isLocal) return undefined;
    tile.audioTrack.attach(el);
    return () => {
      try {
        tile.audioTrack.detach(el);
      } catch (_) {}
    };
  }, [tile.audioTrack, tile.isLocal]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-neutral-800 bg-black aspect-video">
      {tile.videoTrack ? (
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          playsInline
          muted={tile.isLocal}
          autoPlay
        />
      ) : (
        <div className="h-full w-full flex flex-col items-center justify-center text-gray-400 bg-neutral-950">
          <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-2">
            <span className="text-2xl font-bold text-gray-300">
              {tile.name ? tile.name[0].toUpperCase() : "?"}
            </span>
          </div>
          <CameraOff size={20} className="opacity-40" />
          <span className="mt-1 text-xs opacity-40">Camera off</span>
        </div>
      )}
      <div className="absolute left-3 bottom-3 flex items-center gap-2 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
        <span className="font-semibold truncate max-w-[120px]">{tile.name}</span>
        {tile.isLocal && <span className="text-green-400 text-[10px]">You</span>}
        {tile.isMuted && <MicOff size={11} className="text-red-300 flex-shrink-0" />}
      </div>
      <audio ref={audioRef} autoPlay />
    </div>
  );
}

function buildTiles(lkRoom) {
  const tiles = [];

  const pushParticipant = (participant, isLocal) => {
    const videoPub = participant.getTrackPublication(Track.Source.Camera);
    const audioPub = participant.getTrackPublication(Track.Source.Microphone);
    const videoTrack = videoPub?.track && !videoPub.isMuted ? videoPub.track : null;
    const audioTrack = audioPub?.track || null;

    tiles.push({
      id: participant.identity,
      name: participant.name || participant.identity || "Unknown",
      isLocal,
      videoTrack,
      audioTrack,
      isMuted: audioPub?.isMuted ?? true,
    });
  };

  if (lkRoom?.localParticipant) {
    pushParticipant(lkRoom.localParticipant, true);
  }
  lkRoom?.remoteParticipants.forEach((p) => pushParticipant(p, false));

  return tiles;
}

function VideoRoomContent({ room, onLeave }) {
  const livekitRoom = useRoomContext();
  const [tiles, setTiles] = useState([]);
  const [connectionState, setConnectionState] = useState(
    ConnectionState.Disconnected,
  );
  const [micEnabled, setMicEnabled] = useState(false);
  const [camEnabled, setCamEnabled] = useState(false);

  const syncTiles = useCallback(() => {
    if (!livekitRoom) return;
    setTiles(buildTiles(livekitRoom));
    setMicEnabled(Boolean(livekitRoom.localParticipant?.isMicrophoneEnabled));
    setCamEnabled(Boolean(livekitRoom.localParticipant?.isCameraEnabled));
  }, [livekitRoom]);

  useEffect(() => {
    if (!livekitRoom) return undefined;

    const update = () => syncTiles();
    const handleConnected = () => {
      console.log("[LiveKit] Connected to video room");
    };
    const handleDisconnected = () => {
      console.log("[LiveKit] Disconnected from video room");
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
    livekitRoom.on(RoomEvent.TrackSubscribed, update);
    livekitRoom.on(RoomEvent.TrackUnsubscribed, update);
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
      livekitRoom.off(RoomEvent.TrackSubscribed, update);
      livekitRoom.off(RoomEvent.TrackUnsubscribed, update);
      livekitRoom.off(RoomEvent.TrackMuted, update);
      livekitRoom.off(RoomEvent.TrackUnmuted, update);
      livekitRoom.off(RoomEvent.LocalTrackPublished, update);
      livekitRoom.off(RoomEvent.LocalTrackUnpublished, update);
    };
  }, [livekitRoom, syncTiles]);

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
      .setMicrophoneEnabled(true)
      .catch(() => null);
    livekitRoom.localParticipant.setCameraEnabled(true).catch(() => null);
  }, [livekitRoom, connectionState]);

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

  const handleToggleMic = async () => {
    if (!livekitRoom?.localParticipant) return;
    try {
      const next = !micEnabled;
      await livekitRoom.localParticipant.setMicrophoneEnabled(next);
      setMicEnabled(next);
      syncTiles();
    } catch (err) {
      console.error("[LiveKit] Toggle mic failed:", err);
    }
  };

  const handleToggleCam = async () => {
    if (!livekitRoom?.localParticipant) return;
    try {
      const next = !camEnabled;
      await livekitRoom.localParticipant.setCameraEnabled(next);
      setCamEnabled(next);
      syncTiles();
    } catch (err) {
      console.error("[LiveKit] Toggle camera failed:", err);
    }
  };

  const isConnecting =
    connectionState === ConnectionState.Connecting ||
    connectionState === ConnectionState.Reconnecting;
  const isConnected = connectionState === ConnectionState.Connected;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black">
      <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-black">
        <div>
          <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">
            {room.name}
          </h2>
          <p className="text-xs text-gray-400 flex items-center gap-1">
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
          </p>
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
        {isConnecting ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="animate-spin mb-3" size={36} />
            <p className="text-sm font-medium">Connecting to video room...</p>
            <p className="text-xs mt-1 opacity-60">This may take a few seconds</p>
          </div>
        ) : tiles.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <Camera size={36} className="mb-3 opacity-50" />
            <p className="text-sm font-medium">
              {isConnected ? "Waiting for participants..." : "Not connected"}
            </p>
          </div>
        ) : (
          <div
            className={`grid gap-4 h-full ${
              tiles.length === 1
                ? "grid-cols-1"
                : tiles.length === 2
                  ? "grid-cols-1 sm:grid-cols-2"
                  : tiles.length <= 4
                    ? "grid-cols-2"
                    : "grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {tiles.map((tile) => (
              <VideoTile key={tile.id} tile={tile} />
            ))}
          </div>
        )}
      </div>

      <div className="px-4 md:px-6 py-4 border-t border-gray-200 dark:border-neutral-800 bg-white dark:bg-black">
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleToggleMic}
            disabled={!isConnected}
            title={micEnabled ? "Mute microphone" : "Unmute microphone"}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
              micEnabled
                ? "bg-gray-900 dark:bg-white text-white dark:text-black hover:opacity-80"
                : "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40"
            }`}
          >
            {micEnabled ? <Mic size={16} /> : <MicOff size={16} />}
            {micEnabled ? "Mute" : "Unmute"}
          </button>

          <button
            type="button"
            onClick={handleToggleCam}
            disabled={!isConnected}
            title={camEnabled ? "Stop camera" : "Start camera"}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
              camEnabled
                ? "bg-gray-900 dark:bg-white text-white dark:text-black hover:opacity-80"
                : "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40"
            }`}
          >
            {camEnabled ? <Camera size={16} /> : <CameraOff size={16} />}
            {camEnabled ? "Stop Video" : "Start Video"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VideoRoomView({ room, onLeave }) {
  const [displayName, setDisplayName] = useState(() => readDefaultDisplayName());
  const [showNamePrompt, setShowNamePrompt] = useState(true);

  const handleSubmitName = (value) => {
    const normalized = normalizeDisplayName(value);
    setDisplayName(normalized);
    localStorage.setItem("videoDisplayName", normalized);
    setShowNamePrompt(false);
  };

  return (
    <div className="relative flex flex-col h-full bg-white dark:bg-black">
      {showNamePrompt ? (
        <DisplayNamePrompt
          initialName={displayName}
          onSubmit={handleSubmitName}
          onCancel={onLeave}
        />
      ) : (
        <LiveKitRoomWrapper
          room={room}
          roomType="VIDEO"
          displayName={displayName}
        >
          <VideoRoomContent room={room} onLeave={onLeave} />
        </LiveKitRoomWrapper>
      )}
    </div>
  );
}
