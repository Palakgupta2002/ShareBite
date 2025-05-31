// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Optionally, you can add request/response interceptors here, e.g. to attach Authorization token
// api.interceptors.request.use(config => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers["Authorization"] = `Bearer ${token}`;
//   return config;
// });

export default api;
