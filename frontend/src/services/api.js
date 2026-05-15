import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  timeout: 25_000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add the token to headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // FormData must use multipart boundary from the browser; never send application/json
  // or a bare "multipart/form-data" (no boundary) or Spring receives an empty file and S3 is skipped.
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    const h = config.headers;
    if (h && typeof h.delete === "function") {
      h.delete("Content-Type");
      h.delete("content-type");
    } else if (h) {
      delete h["Content-Type"];
      delete h["content-type"];
    }
  }
  return config;
});

export default API;
