import React, { useCallback, useEffect, useRef, useState } from "react";
import { Room, RoomEvent, Track } from "livekit-client";
import { Camera, CameraOff, Loader2, LogOut, Mic, MicOff, User } from "lucide-react";
import { fetchLiveKitToken, joinRoomApi } from "../../services/roomsApi";

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
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Enter your name</h2>
              <p className="text-xs text-gray-500">This shows to other participants.</p>
            </div>
          </div>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            placeholder="Your display name"
            className="w-full px-4 py-3 rounded-2xl border border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 text-sm outline-none focus:ring-2 ring-gray-900/5 transition-all"
          />
          {error && <p className="mt-2 text-xs font-semibold text-red-500">{error}</p>}
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
      tile.videoTrack.detach(el);
    };
  }, [tile.videoTrack]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !tile.audioTrack || tile.isLocal) return undefined;
    tile.audioTrack.attach(el);
    return () => {
      tile.audioTrack.detach(el);
    };
  }, [tile.audioTrack, tile.isLocal]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-neutral-800 bg-black">
      {tile.videoTrack ? (
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          playsInline
          muted={tile.isLocal}
        />
      ) : (
        <div className="h-full w-full flex flex-col items-center justify-center text-gray-400 bg-neutral-950">
          <CameraOff size={36} />
          <span className="mt-2 text-xs">Camera off</span>
        </div>
      )}
      <div className="absolute left-3 bottom-3 flex items-center gap-2 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">
        <span className="font-semibold truncate max-w-30">{tile.name}</span>
        {tile.isMuted && <MicOff size={12} className="text-red-300" />}
      </div>
      <audio ref={audioRef} autoPlay />
    </div>
  );
}

function buildTiles(room) {
  const tiles = [];
  const pushParticipant = (participant, isLocal) => {
    const videoPub = participant.getTrackPublication(Track.Source.Camera);
    const audioPub = participant.getTrackPublication(Track.Source.Microphone);
    tiles.push({
      id: participant.identity,
      name: participant.name || participant.identity,
      isLocal,
      videoTrack: videoPub?.track || null,
      audioTrack: audioPub?.track || null,
      isMuted: audioPub?.isMuted ?? true,
    });
  };

  if (room.localParticipant) {
    pushParticipant(room.localParticipant, true);
  }
  room.participants.forEach((p) => pushParticipant(p, false));
  return tiles;
}

export default function VideoRoom({ room, onLeave }) {
  const [displayName, setDisplayName] = useState(() => readDefaultDisplayName());
  const [showNamePrompt, setShowNamePrompt] = useState(true);
  const [tiles, setTiles] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [camEnabled, setCamEnabled] = useState(false);
  const [error, setError] = useState("");
  const roomRef = useRef(null);

  const syncLocalState = useCallback((lkRoom) => {
    const lp = lkRoom.localParticipant;
    setMicEnabled(Boolean(lp?.isMicrophoneEnabled));
    setCamEnabled(Boolean(lp?.isCameraEnabled));
  }, []);

  const syncTiles = useCallback((lkRoom) => {
    setTiles(buildTiles(lkRoom));
    syncLocalState(lkRoom);
  }, [syncLocalState]);

  const disconnect = useCallback(async () => {
    const lkRoom = roomRef.current;
    if (!lkRoom) return;
    lkRoom.removeAllListeners();
    await lkRoom.disconnect();
    roomRef.current = null;
  }, []);

  const connect = useCallback(async () => {
    if (!room?.id) return;
    setIsConnecting(true);
    setError("");

    try {
      await joinRoomApi(room.id);
      const cred = await fetchLiveKitToken(room.id, displayName);
      const lkRoom = new Room();
      roomRef.current = lkRoom;
      await lkRoom.connect(cred.serverUrl, cred.token, { autoSubscribe: true });

      lkRoom.on(RoomEvent.ParticipantConnected, () => syncTiles(lkRoom));
      lkRoom.on(RoomEvent.ParticipantDisconnected, () => syncTiles(lkRoom));
      lkRoom.on(RoomEvent.TrackSubscribed, () => syncTiles(lkRoom));
      lkRoom.on(RoomEvent.TrackUnsubscribed, () => syncTiles(lkRoom));
      lkRoom.on(RoomEvent.TrackMuted, () => syncTiles(lkRoom));
      lkRoom.on(RoomEvent.TrackUnmuted, () => syncTiles(lkRoom));
      lkRoom.on(RoomEvent.LocalTrackPublished, () => syncTiles(lkRoom));
      lkRoom.on(RoomEvent.LocalTrackUnpublished, () => syncTiles(lkRoom));
      lkRoom.on(RoomEvent.Disconnected, () => {
        setError("Disconnected from the video room.");
      });

      await lkRoom.localParticipant.setMicrophoneEnabled(true);
      await lkRoom.localParticipant.setCameraEnabled(true);

      syncTiles(lkRoom);
    } catch (e) {
      console.error(e);
      const status = e?.response?.status;
      const apiMessage = e?.response?.data?.message;
      const rawMessage = String(e?.message || "");
      const lower = rawMessage.toLowerCase();
      let message = "Could not connect to the video room.";
      if (status === 401) {
        message = "Your session expired. Please log in again.";
      } else if (status === 403) {
        message = "You are not allowed to join this room.";
      } else if (apiMessage) {
        message = String(apiMessage);
      } else if (lower.includes("network") || lower.includes("connect") || lower.includes("websocket")) {
        message = "Could not reach the LiveKit server. Start it and try again.";
      }
      setError(message);
      await disconnect();
    } finally {
      setIsConnecting(false);
    }
  }, [room?.id, displayName, syncTiles, disconnect]);

  useEffect(() => {
    if (!showNamePrompt) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [showNamePrompt, connect, disconnect]);

  const handleLeave = async () => {
    await disconnect();
    onLeave();
  };

  const handleToggleMic = async () => {
    const lkRoom = roomRef.current;
    if (!lkRoom) return;
    try {
      const next = !micEnabled;
      await lkRoom.localParticipant.setMicrophoneEnabled(next);
      setMicEnabled(next);
      syncTiles(lkRoom);
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleCam = async () => {
    const lkRoom = roomRef.current;
    if (!lkRoom) return;
    try {
      const next = !camEnabled;
      await lkRoom.localParticipant.setCameraEnabled(next);
      setCamEnabled(next);
      syncTiles(lkRoom);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitName = (value) => {
    const normalized = normalizeDisplayName(value);
    setDisplayName(normalized);
    localStorage.setItem("videoDisplayName", normalized);
    setShowNamePrompt(false);
  };

  return (
    <div className="relative flex flex-col h-full bg-white dark:bg-black">
      {showNamePrompt && (
        <DisplayNamePrompt
          initialName={displayName}
          onSubmit={handleSubmitName}
          onCancel={onLeave}
        />
      )}

      <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-black">
        <div>
          <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100">{room.name}</h2>
          <p className="text-xs text-gray-400">Video room</p>
        </div>
        <button
          type="button"
          onClick={handleLeave}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-neutral-800 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
        >
          <LogOut size={16} /> Leave
        </button>
      </div>

      {error && (
        <div className="px-4 md:px-6 py-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-b border-red-100 dark:border-red-900">
          {error}
        </div>
      )}

      <div className="flex-1 p-4 md:p-6">
        {isConnecting ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="animate-spin" size={30} />
            <p className="mt-3 text-sm">Connecting to video room...</p>
          </div>
        ) : tiles.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <Camera size={30} />
            <p className="mt-3 text-sm">Waiting for participants...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 h-full">
            {tiles.map((tile) => (
              <VideoTile key={tile.id} tile={tile} />
            ))}
          </div>
        )}
      </div>

      <div className="px-4 md:px-6 py-3 border-t border-gray-200 dark:border-neutral-800 bg-white dark:bg-black">
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleToggleMic}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              micEnabled
                ? "bg-gray-900 dark:bg-white text-white dark:text-black"
                : "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400"
            }`}
          >
            {micEnabled ? <Mic size={16} /> : <MicOff size={16} />}
            {micEnabled ? "Mute" : "Unmute"}
          </button>
          <button
            type="button"
            onClick={handleToggleCam}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              camEnabled
                ? "bg-gray-900 dark:bg-white text-white dark:text-black"
                : "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400"
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
