import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useAuth } from "../../features/auth/AuthContext";

const CustomerLayout = () => {

  const {
  user,
  isAuthenticated,
  isAdmin,
  logout,
} = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout;