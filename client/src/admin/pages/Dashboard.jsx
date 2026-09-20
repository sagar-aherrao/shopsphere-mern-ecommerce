import { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/adminService";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await getDashboardStats();

        setDashboard(response.data);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-gray-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-600">
        {error}
      </div>
    );
  }

  const stats = [
    {
      title: "Total Categories",
      value: dashboard?.categories?.total ?? 0,
    },
    {
      title: "Active Categories",
      value: dashboard?.categories?.active ?? 0,
    },
    {
      title: "Total Products",
      value: dashboard?.products?.total ?? 0,
    },
    {
      title: "Active Products",
      value: dashboard?.products?.active ?? 0,
    },
    {
      title: "Featured Products",
      value: dashboard?.products?.featured ?? 0,
    },
    {
      title: "Out of Stock",
      value: dashboard?.products?.outOfStock ?? 0,
    },
  ];

  return (
    <div>

      {/* Page heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Overview of your ecommerce store.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-gray-500">
              {stat.title}
            </p>

            <p className="mt-3 text-3xl font-bold text-gray-800">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Stock */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">
            Product Stock
          </h2>

          <div className="mt-5 space-y-4">

            <div className="flex justify-between">
              <span className="text-gray-600">
                Out of stock
              </span>

              <span className="font-semibold text-red-600">
                {dashboard?.products?.outOfStock ?? 0}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">
                Low stock
              </span>

              <span className="font-semibold text-orange-600">
                {dashboard?.products?.lowStock ?? 0}
              </span>
            </div>

          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">
            Product Status
          </h2>

          <div className="mt-5 space-y-4">

            <div className="flex justify-between">
              <span className="text-gray-600">
                Active
              </span>

              <span className="font-semibold text-green-600">
                {dashboard?.products?.active ?? 0}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">
                Inactive
              </span>

              <span className="font-semibold text-gray-600">
                {dashboard?.products?.inactive ?? 0}
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;