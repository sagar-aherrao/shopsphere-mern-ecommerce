import { createContext, useContext, useEffect, useState } from "react";
import authService from "./authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check logged-in user when application starts
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      authService
        .getMe()
        .then((response) => {
          if (response.success) {
            setUser(response.user);
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Register
  const register = async (userData) => {
    const response = await authService.register(userData);

    if (response.success) {
      setUser(response.user);
    }

    return response;
  };

  // Login
  const login = async (userData) => {
    const response = await authService.login(userData);

    if (response.success) {
      setUser(response.user);
    }

    return response;
  };

  // Logout
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};