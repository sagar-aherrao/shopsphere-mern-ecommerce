import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const statuses = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/orders/admin/order/${id}`);

      if (response.data.success) {
        setOrder(response.data.data);
        setStatus(response.data.data.orderStatus || "Pending");
      } else {
        setError(response.data.message || "Failed to fetch order");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch order"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async () => {
    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      const response = await api.patch(
        `/orders/admin/order/${id}/status`,
        {
          status,
        }
      );

      if (response.data.success) {
        setOrder(response.data.data);
        setSuccess("Order status updated successfully.");
      } else {
        setError(
          response.data.message || "Failed to update order status"
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Loading order...</p>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="p-6">
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-4 text-red-600">
          {error}
        </div>

        <button
          onClick={() => navigate("/admin/orders")}
          className="rounded bg-gray-700 px-4 py-2 text-white"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Order Details
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Order #{order._id.slice(-8).toUpperCase()}
          </p>
        </div>

        <Link
          to="/admin/orders"
          className="rounded bg-gray-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Back to Orders
        </Link>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded border border-green-200 bg-green-50 p-4 text-green-600">
          {success}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Customer Information */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Customer
          </h2>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Name</p>
              <p className="text-sm font-medium text-gray-800">
                {order.user?.name || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm text-gray-800">
                {order.user?.email || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Payment
          </h2>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">
                Payment Method
              </p>
              <p className="text-sm font-medium text-gray-800">
                {order.paymentMethod || "COD"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Payment Status
              </p>
              <p className="text-sm font-medium text-gray-800">
                {order.paymentStatus || "Pending"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Order Date</p>
              <p className="text-sm text-gray-800">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Order Status */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Order Status
          </h2>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mb-4 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button
            onClick={handleStatusUpdate}
            disabled={updating || status === order.orderStatus}
            className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {updating ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="mt-6 rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Shipping Address
        </h2>

        <div className="text-sm leading-6 text-gray-600">
          {order.shippingAddress ? (
            <>
              <p>
                {order.shippingAddress.address}
              </p>

              <p>
                {order.shippingAddress.city},{" "}
                {order.shippingAddress.state}{" "}
                {order.shippingAddress.postalCode}
              </p>

              <p>{order.shippingAddress.country}</p>
            </>
          ) : (
            <p>No shipping address available.</p>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="mt-6 rounded-lg bg-white shadow">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Order Items
          </h2>
        </div>

        <div className="divide-y">
          {order.orderItems?.map((item) => (
            <div
              key={item._id || item.product}
              className="flex items-center gap-4 p-6"
            >
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-800">
                  {item.name}
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Quantity: {item.qty}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">
                  ₹{Number(item.price || 0).toFixed(2)}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Total: ₹
                  {(
                    Number(item.price || 0) *
                    Number(item.qty || 0)
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t bg-gray-50 p-6">
          <div className="ml-auto max-w-sm space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Items</span>
              <span>
                ₹{Number(order.itemsPrice || 0).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span>
                ₹{Number(order.shippingPrice || 0).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between border-t pt-3 text-base font-bold text-gray-800">
              <span>Total</span>
              <span>
                ₹{Number(order.totalPrice || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;