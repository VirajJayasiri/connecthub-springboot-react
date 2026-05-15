import React, { useCallback, useEffect, useMemo, useState } from "react";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import { Loader2, RefreshCw, WifiOff } from "lucide-react";
import { fetchLiveKitToken } from "../../services/roomsApi";

const FALLBACK_LIVEKIT_URL =
  import.meta.env.VITE_LIVEKIT_URL || "ws://localhost:7880";

const LIVEKIT_DOWN_MESSAGE =
  "Could not reach LiveKit server. Make sure Docker LiveKit is running.";

function readStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const user = JSON.parse(raw);
    const id = user?._id || user?.id || null;
    const name = user?.fullName || user?.username || user?.email || null;
    return { id, name };
  } catch {
    return null;
  }
}

function sanitizeRoomName(value) {
  return String(value || "").replace(/[^a-zA-Z0-9_-]/g, "_");
}

function resolveRoomName(roomId, roomName) {
  if (roomId) {
    return `connecthub-room-${sanitizeRoomName(roomId)}`;
  }
  const safe = sanitizeRoomName(roomName);
  if (safe.startsWith("connecthub-room-")) {
    return safe;
  }
  return `connecthub-room-${safe}`;
}

function buildErrorMessage(error) {
  const raw = String(error?.message || "").trim();
  const lower = raw.toLowerCase();
  if (
    lower.includes("websocket") ||
    lower.includes("network") ||
    lower.includes("connect") ||
    lower.includes("failed to fetch") ||
    lower.includes("econnrefused")
  ) {
    return LIVEKIT_DOWN_MESSAGE;
  }
  const apiMessage = error?.response?.data?.message;
  return apiMessage || raw || "Could not connect to LiveKit.";
}

export default function LiveKitRoomWrapper({
  room,
  roomType,
  displayName,
  children,
}) {
  const [tokenInfo, setTokenInfo] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const storedUser = useMemo(() => readStoredUser(), []);
  const identity = storedUser?.id || null;
  const resolvedName = displayName || storedUser?.name || "Guest";
  const resolvedRoomName = useMemo(
    () => resolveRoomName(room?.id, room?.name),
    [room?.id, room?.name],
  );

  const requestToken = useCallback(async () => {
    if (!room?.id) return;
    if (!identity) {
      setError("User session is missing. Please log in again.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await fetchLiveKitToken({
        roomId: room.id,
        roomName: resolvedRoomName,
        userId: identity,
        displayName: resolvedName,
        roomType,
      });
      setTokenInfo(data);
      console.log("[LiveKit] Token ready for room:", data?.roomName);
    } catch (err) {
      console.error("[LiveKit] Token request failed:", err);
      setError(buildErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [room?.id, identity, resolvedRoomName, resolvedName, roomType]);

  useEffect(() => {
    requestToken();
  }, [requestToken, retryCount]);

  const handleRetry = () => {
    setTokenInfo(null);
    setError("");
    setRetryCount((count) => count + 1);
  };

  const handleRoomError = (err) => {
    console.error("[LiveKit] Connection error:", err);
    setError(buildErrorMessage(err));
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 bg-white dark:bg-black">
        <WifiOff size={34} className="text-red-400 mb-3" />
        <p className="text-sm text-red-600 dark:text-red-400 whitespace-pre-wrap max-w-md">
          {error}
        </p>
        <button
          type="button"
          onClick={handleRetry}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-sm font-semibold"
        >
          <RefreshCw size={16} /> Retry
        </button>
      </div>
    );
  }

  if (isLoading || !tokenInfo) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 bg-white dark:bg-black">
        <Loader2 size={34} className="animate-spin text-gray-400 mb-3" />
        <p className="text-sm text-gray-500">Connecting to LiveKit...</p>
      </div>
    );
  }

  const serverUrl = tokenInfo.url || tokenInfo.serverUrl || FALLBACK_LIVEKIT_URL;

  return (
    <LiveKitRoom
      token={tokenInfo.token}
      serverUrl={serverUrl}
      connect
      audio
      video={roomType === "VIDEO"}
      options={{ autoSubscribe: true, adaptiveStream: false, dynacast: false }}
      onError={handleRoomError}
    >
      {roomType === "VOICE" && <RoomAudioRenderer />}
      {children}
    </LiveKitRoom>
  );
}
