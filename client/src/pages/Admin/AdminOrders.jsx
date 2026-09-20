import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(6);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    totalOrders: 0,
    totalPages: 0,
  });

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      params.append("page", page);
      params.append("limit", limit);

      if (search.trim()) {
        params.append("search", search.trim());
      }

      if (statusFilter) {
        params.append("status", statusFilter);
      }

      if (paymentFilter) {
        params.append("paymentMethod", paymentFilter);
      }

      const response = await api.get(
        `/orders/admin/order?${params.toString()}`
      );

      if (response.data.success) {
        setOrders(response.data.data);

        setPagination(
          response.data.pagination || {
            page,
            limit,
            totalOrders: response.data.data.length,
            totalPages: 1,
          }
        );
      } else {
        setError(
          response.data.message || "Failed to fetch orders"
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to fetch orders"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderStats = async () => {
    try {
      setStatsLoading(true);

      const response = await api.get(
        "/orders/admin/order/stats"
      );

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error(
        "Failed to fetch order statistics:",
        err
      );
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchOrderStats();
  }, [page, statusFilter, paymentFilter]);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {!statsLoading && stats && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total Orders */}
          <div className="rounded-lg bg-white p-5 shadow">
            <p className="text-sm font-medium text-gray-500">
              Total Orders
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-800">
              {stats.totalOrders}
            </p>
          </div>

          {/* Pending */}
          <div className="rounded-lg bg-white p-5 shadow">
            <p className="text-sm font-medium text-gray-500">
              Pending
            </p>

            <p className="mt-2 text-2xl font-bold text-yellow-600">
              {stats.pendingOrders}
            </p>
          </div>

          {/* Processing */}
          <div className="rounded-lg bg-white p-5 shadow">
            <p className="text-sm font-medium text-gray-500">
              Processing
            </p>

            <p className="mt-2 text-2xl font-bold text-blue-600">
              {stats.processingOrders}
            </p>
          </div>

          {/* Delivered */}
          <div className="rounded-lg bg-white p-5 shadow">
            <p className="text-sm font-medium text-gray-500">
              Delivered
            </p>

            <p className="mt-2 text-2xl font-bold text-green-600">
              {stats.deliveredOrders}
            </p>
          </div>

          {/* Confirmed */}
          <div className="rounded-lg bg-white p-5 shadow">
            <p className="text-sm font-medium text-gray-500">
              Confirmed
            </p>

            <p className="mt-2 text-2xl font-bold text-indigo-600">
              {stats.confirmedOrders}
            </p>
          </div>

          {/* Shipped */}
          <div className="rounded-lg bg-white p-5 shadow">
            <p className="text-sm font-medium text-gray-500">
              Shipped
            </p>

            <p className="mt-2 text-2xl font-bold text-purple-600">
              {stats.shippedOrders}
            </p>
          </div>

          {/* Cancelled */}
          <div className="rounded-lg bg-white p-5 shadow">
            <p className="text-sm font-medium text-gray-500">
              Cancelled
            </p>

            <p className="mt-2 text-2xl font-bold text-red-600">
              {stats.cancelledOrders}
            </p>
          </div>

          {/* Revenue */}
          <div className="rounded-lg bg-white p-5 shadow">
            <p className="text-sm font-medium text-gray-500">
              Total Revenue
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-800">
              ₹{Number(stats.totalRevenue || 0).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      )}
      <div className="mb-6 rounded-lg bg-white p-4 shadow">
        <div className="grid gap-4 md:grid-cols-4">

          {/* Search */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Search
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setPage(1);
                  fetchOrders();
                }
              }}
              placeholder="Order ID, customer name or email"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Status
            </label>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Payment
            </label>

            <select
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setPage(1);
              }}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">All Payments</option>
              <option value="COD">COD</option>
              <option value="Razorpay">Razorpay</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => {
              setPage(1);
              fetchOrders();
            }}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Search
          </button>

          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("");
              setPaymentFilter("");
              setPage(1);
            }}
            className="rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Orders
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage customer orders
          </p>
        </div>

        <button
          onClick={() => {
            fetchOrders();
            fetchOrderStats();
          }}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center shadow">
          <p className="text-gray-500">No orders found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow">
          <div className="mb-3 text-sm text-gray-500">
            Showing {orders.length} of {pagination.totalOrders} orders
          </div>
          <table className="min-w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Order ID
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Customer
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Total
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Payment
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Date
                </th>

                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="transition hover:bg-gray-50"
                >
                  <td className="px-4 py-4 text-sm font-medium text-gray-800">
                    #{order._id.slice(-8).toUpperCase()}
                  </td>

                  <td className="px-4 py-4">
                    <p className="text-sm font-medium text-gray-800">
                      {order.user?.name || "N/A"}
                    </p>

                    <p className="text-xs text-gray-500">
                      {order.user?.email || "N/A"}
                    </p>
                  </td>

                  <td className="px-4 py-4 text-sm font-medium text-gray-800">
                    ₹{Number(order.totalPrice || 0).toFixed(2)}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-600">
                    {order.paymentMethod || "COD"}
                  </td>

                  <td className="px-4 py-4">
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                      {order.orderStatus || "Pending"}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-4 text-right">
                    <Link
                      to={`/admin/orders/${order._id}`}
                      className="rounded bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-700"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between rounded-lg bg-white p-4 shadow">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="rounded border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <div className="text-sm text-gray-600">
                Page {pagination.page} of{" "}
                {pagination.totalPages}
              </div>

              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="rounded border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;