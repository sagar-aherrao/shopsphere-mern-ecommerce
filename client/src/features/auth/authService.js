import api from "../../services/api";

// Register
const register = async (userData) => {
  const response = await api.post("/auth/register", userData);

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};

// Login
const login = async (userData) => {
  const response = await api.post("/auth/login", userData);

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};

// Get current user
const getMe = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};

// Logout
const logout = () => {
  localStorage.removeItem("token");
};

const authService = {
  register,
  login,
  getMe,
  logout,
};

export default authService;