import React, { useCallback, useEffect, useRef, useState } from "react";
import { Room, RoomEvent, Track, ConnectionState } from "livekit-client";
import {
  Camera,
  CameraOff,
  Loader2,
  LogOut,
  Mic,
  MicOff,
  User,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";
import { fetchLiveKitToken } from "../../services/roomsApi";

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
        <span className="font-semibold truncate max-w-[120px]">
          {tile.name}
        </span>
        {tile.isLocal && (
          <span className="text-green-400 text-[10px]">You</span>
        )}
        {tile.isMuted && (
          <MicOff size={11} className="text-red-300 flex-shrink-0" />
        )}
      </div>
      <audio ref={audioRef} autoPlay />
    </div>
  );
}

/** Build tiles from livekit-client v2 Room object */
function buildTiles(lkRoom) {
  const tiles = [];

  const pushParticipant = (participant, isLocal) => {
    // livekit-client v2: getTrackPublication
    const videoPub = participant.getTrackPublication(Track.Source.Camera);
    const audioPub = participant.getTrackPublication(Track.Source.Microphone);

    // A track is live only when it exists and is not muted at the publication level
    const videoTrack =
      videoPub?.track && !videoPub.isMuted ? videoPub.track : null;
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

  if (lkRoom.localParticipant) {
    pushParticipant(lkRoom.localParticipant, true);
  }

  // livekit-client v2: remoteParticipants is a Map<string, RemoteParticipant>
  lkRoom.remoteParticipants.forEach((p) => pushParticipant(p, false));

  return tiles;
}

export default function VideoRoom({ room, onLeave }) {
  const [displayName, setDisplayName] = useState(() =>
    readDefaultDisplayName(),
  );
  const [showNamePrompt, setShowNamePrompt] = useState(true);
  const [tiles, setTiles] = useState([]);
  const [connectionState, setConnectionState] = useState(
    ConnectionState.Disconnected,
  );
  const [micEnabled, setMicEnabled] = useState(false);
  const [camEnabled, setCamEnabled] = useState(false);
  const [error, setError] = useState("");
  const roomRef = useRef(null);
  const isConnectingRef = useRef(false);

  const isConnecting =
    connectionState === ConnectionState.Connecting ||
    connectionState === ConnectionState.Reconnecting;
  const isConnected = connectionState === ConnectionState.Connected;

  const syncTiles = useCallback((lkRoom) => {
    setTiles(buildTiles(lkRoom));
    if (lkRoom.localParticipant) {
      setMicEnabled(Boolean(lkRoom.localParticipant.isMicrophoneEnabled));
      setCamEnabled(Boolean(lkRoom.localParticipant.isCameraEnabled));
    }
  }, []);

  const stopLocalTracks = useCallback((lkRoom) => {
    const participant = lkRoom?.localParticipant;
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
  }, []);

  const cleanupRoom = useCallback(
    async (lkRoom, options = {}) => {
      if (!lkRoom) {
        setTiles([]);
        setMicEnabled(false);
        setCamEnabled(false);
        setConnectionState(ConnectionState.Disconnected);
        return;
      }

      if (options.log) {
        console.log("Cleaning previous room instance");
      }

      try {
        lkRoom.removeAllListeners();
      } catch (_) {}

      try {
        await lkRoom.localParticipant?.setMicrophoneEnabled(false);
      } catch (_) {}
      try {
        await lkRoom.localParticipant?.setCameraEnabled(false);
      } catch (_) {}

      stopLocalTracks(lkRoom);

      if (!options.skipDisconnect) {
        try {
          await lkRoom.disconnect();
        } catch (_) {}
      }

      if (roomRef.current === lkRoom) {
        roomRef.current = null;
      }

      isConnectingRef.current = false;
      setTiles([]);
      setMicEnabled(false);
      setCamEnabled(false);
      setConnectionState(ConnectionState.Disconnected);
    },
    [stopLocalTracks],
  );

  const disconnectRoom = useCallback(async () => {
    const lkRoom = roomRef.current;
    if (!lkRoom) {
      setTiles([]);
      setMicEnabled(false);
      setCamEnabled(false);
      setConnectionState(ConnectionState.Disconnected);
      return;
    }
    console.log("Disconnected from LiveKit");
    await cleanupRoom(lkRoom);
  }, [cleanupRoom]);

  const connectRoom = useCallback(async () => {
    if (!room?.id) return;
    const currentState = roomRef.current?.connectionState;
    if (
      isConnectingRef.current ||
      currentState === ConnectionState.Connected ||
      currentState === ConnectionState.Connecting ||
      currentState === ConnectionState.Reconnecting
    ) {
      return;
    }

    // Always kill any existing room first so we never reuse stale session state
    // (reusing a Room after server restart causes STATE_MISMATCH reconnect errors)
    const existing = roomRef.current;
    if (existing) {
      await cleanupRoom(existing, { log: true });
    }

    setError("");
    setTiles([]);
    setConnectionState(ConnectionState.Connecting);
    isConnectingRef.current = true;
    console.log("Connecting to LiveKit...");

    let lkRoom;
    try {
      let cred;
      try {
        cred = await fetchLiveKitToken(room.id, displayName);
      } catch (tokenErr) {
        console.error("[VideoRoom] Token error:", tokenErr);
        throw tokenErr;
      }

      if (!cred?.serverUrl || !cred?.token) {
        throw new Error("Backend returned an invalid LiveKit credential.");
      }

      // Always create a brand-new Room — never reuse to avoid stale reconnect
      lkRoom = new Room({
        adaptiveStream: false,
        dynacast: false,
        reconnectPolicy: null,
      });
      roomRef.current = lkRoom;

      const refresh = () => syncTiles(lkRoom);

      lkRoom.on(RoomEvent.Connected, () => {
        if (roomRef.current !== lkRoom) return;
        setConnectionState(ConnectionState.Connected);
        setError("");
        refresh();
      });
      lkRoom.on(RoomEvent.Disconnected, (reason) => {
        if (roomRef.current !== lkRoom) return;
        console.log("Disconnected from LiveKit");
        setConnectionState(ConnectionState.Disconnected);
        if (reason) {
          console.warn("[VideoRoom] LiveKit disconnected:", reason);
        }
        cleanupRoom(lkRoom, { skipDisconnect: true });
      });
      lkRoom.on(RoomEvent.ParticipantConnected, refresh);
      lkRoom.on(RoomEvent.ParticipantDisconnected, refresh);
      lkRoom.on(RoomEvent.TrackSubscribed, refresh);
      lkRoom.on(RoomEvent.TrackUnsubscribed, refresh);
      lkRoom.on(RoomEvent.TrackMuted, refresh);
      lkRoom.on(RoomEvent.TrackUnmuted, refresh);
      lkRoom.on(RoomEvent.LocalTrackPublished, refresh);
      lkRoom.on(RoomEvent.LocalTrackUnpublished, refresh);
      lkRoom.on(RoomEvent.ConnectionStateChanged, (state) => {
        if (roomRef.current !== lkRoom) return;
        setConnectionState(state);
      });

      // maxRetries: 0 prevents auto-reconnect with stale session after server restart
      await lkRoom.connect(cred.serverUrl, cred.token, {
        autoSubscribe: true,
        maxRetries: 0,
      });

      // Enable mic and camera after connecting
      try {
        await lkRoom.localParticipant.setMicrophoneEnabled(true);
      } catch (micErr) {
        console.warn("Could not enable microphone:", micErr);
      }
      try {
        await lkRoom.localParticipant.setCameraEnabled(true);
      } catch (camErr) {
        console.warn("Could not enable camera:", camErr);
      }

      syncTiles(lkRoom);
    } catch (e) {
      console.error("[VideoRoom] Connection error:", e);
      setConnectionState(ConnectionState.Disconnected);

      const status = e?.response?.status;
      const apiMessage = e?.response?.data?.message;
      const rawMessage = String(e?.message || "");
      const lower = rawMessage.toLowerCase();

      let message;
      if (status === 401) {
        message = "Your session expired. Please log in again.";
      } else if (status === 403) {
        message = "You are not allowed to join this room.";
      } else if (apiMessage) {
        message = String(apiMessage);
      } else if (
        lower.includes("network") ||
        lower.includes("connect") ||
        lower.includes("websocket") ||
        lower.includes("failed to fetch") ||
        lower.includes("econnrefused")
      ) {
        message =
          'Could not reach the LiveKit server. Make sure the Docker container is running:\n\ndocker run --rm -p 7880:7880 -p 7881:7881 -p 7882:7882/udp livekit/livekit-server --dev --keys "devkey: secret"';
      } else {
        message = `Could not connect: ${rawMessage || "Unknown error"}`;
      }
      setError(message);

      if (lkRoom) {
        await cleanupRoom(lkRoom);
      }
      roomRef.current = null;
    } finally {
      isConnectingRef.current = false;
    }
  }, [room?.id, displayName, syncTiles, cleanupRoom]);

  // Connect when name prompt is dismissed
  useEffect(() => {
    if (!showNamePrompt) {
      connectRoom();
    }
    return () => {
      disconnectRoom();
    };
  }, [showNamePrompt, connectRoom, disconnectRoom]);

  const handleLeave = async () => {
    await disconnectRoom();
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

      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-black flex-shrink-0">
        <div className="flex items-center gap-3">
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
                  <Loader2 size={11} className="animate-spin text-yellow-500" />{" "}
                  Connecting…
                </>
              ) : (
                <>
                  <WifiOff size={11} className="text-red-400" /> Disconnected
                </>
              )}
            </p>
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

      {/* Error banner */}
      {error && (
        <div className="px-4 md:px-6 py-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-b border-red-100 dark:border-red-900 flex items-start justify-between gap-3 flex-shrink-0">
          <pre className="whitespace-pre-wrap font-sans flex-1">{error}</pre>
          <button
            type="button"
            onClick={connectRoom}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-800/50 text-red-700 dark:text-red-300 text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-colors"
          >
            <RefreshCw size={13} /> Retry
          </button>
        </div>
      )}

      {/* Video grid */}
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        {isConnecting ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="animate-spin mb-3" size={36} />
            <p className="text-sm font-medium">Connecting to video room…</p>
            <p className="text-xs mt-1 opacity-60">
              This may take a few seconds
            </p>
          </div>
        ) : tiles.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <Camera size={36} className="mb-3 opacity-50" />
            <p className="text-sm font-medium">
              {isConnected ? "Waiting for participants…" : "Not connected"}
            </p>
            {!isConnected && !error && (
              <button
                type="button"
                onClick={connectRoom}
                className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-semibold hover:opacity-90"
              >
                <RefreshCw size={15} /> Connect
              </button>
            )}
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

      {/* Controls */}
      <div className="px-4 md:px-6 py-4 border-t border-gray-200 dark:border-neutral-800 bg-white dark:bg-black flex-shrink-0">
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
