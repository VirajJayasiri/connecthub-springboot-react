/**
 * Browser-facing URLs (Vite injects VITE_* at build time).
 * API_ORIGIN: http://localhost:8080 — REST + SockJS (/ws)
 * API_BASE_URL: http://localhost:8080/api — axios baseURL
 */
const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api"
).replace(/\/$/, "");

export const API_BASE_URL = apiBaseUrl;
export const API_ORIGIN =
  apiBaseUrl.replace(/\/api$/i, "") || "http://localhost:8080";
export const LIVEKIT_WS_URL =
  import.meta.env.VITE_LIVEKIT_URL || "ws://localhost:7880";
