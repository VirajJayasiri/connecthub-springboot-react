import axios from "axios";
import { API_BASE_URL } from "../config/env.js";

const API = axios.create({
  baseURL: API_BASE_URL,
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
