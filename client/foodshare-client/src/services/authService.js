// src/services/authService.js
import api from "./api";

export const signUp = async (name, email, password) => {
  const response = await api.post("/auth/signup", { name, email, password });
  // response.data should contain { _id, name, email, token }
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  // response.data should contain { _id, name, email, token }
  return response.data;
};

