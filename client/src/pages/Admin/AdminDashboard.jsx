import { useAuth } from "../../features/auth/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow">
        <h1 className="mb-4 text-3xl font-bold">
          Admin Dashboard
        </h1>

        <p className="text-gray-600">
          Welcome, {user?.name}
        </p>

        <p className="mt-2">
          Role:{" "}
          <span className="font-semibold">
            {user?.role}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;