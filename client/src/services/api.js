import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return "";
  }

  // Already a complete URL
  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://")
  ) {
    return imagePath;
  }

  // Remove /api from VITE_API_URL
  const backendUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");

  // Make sure there is only one /
  return `${backendUrl}/${imagePath.replace(/^\/+/, "")}`;
};

export default api;