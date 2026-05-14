import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
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
  return config;
});

export default API;
